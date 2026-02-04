package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.*;
import com.hms.hms_backend.dtos.request.AddPrescriptionRequest;
import com.hms.hms_backend.dtos.request.PrescriptionLineItemRequest;
import com.hms.hms_backend.dtos.response.PrescriptionMedicineResponse;
import com.hms.hms_backend.dtos.response.PrescriptionResponse;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.InvoiceService;
import com.hms.hms_backend.services.PrescriptionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;


@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionDao prescriptionDao;
    private final PrescriptionLineItemDao lineItemDao;
    private final PatientMedicalRecordDao recordDao;
    private final PatientDao patientDao;
    private final DoctorDao doctorDao;
    private final MedicineRecordDao medicineDao;
    private final UserAccountDao userAccountDao;
    private final JwtTokenUtil jwtTokenUtil;
    private final InvoiceService invoiceService;
    public PrescriptionServiceImpl(
            PrescriptionDao prescriptionDao, PrescriptionLineItemDao lineItemDao, PatientMedicalRecordDao recordDao,
            PatientDao patientDao, DoctorDao doctorDao, MedicineRecordDao medicineDao,
            UserAccountDao userAccountDao,
            JwtTokenUtil jwtTokenUtil, InvoiceService invoiceService) {

        this.prescriptionDao = prescriptionDao;
        this.lineItemDao = lineItemDao;
        this.recordDao = recordDao;
        this.patientDao = patientDao;
        this.doctorDao = doctorDao;
        this.medicineDao = medicineDao;
        this.userAccountDao = userAccountDao;
        this.jwtTokenUtil = jwtTokenUtil;

        this.invoiceService = invoiceService;
    }

    // ================= ADD PRESCRIPTION =================
    @Override
    @Transactional
    public PrescriptionResponse addPrescription(AddPrescriptionRequest request) {

        // 🔐 Get logged-in doctor from security context
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserAccount userAccount =
                (UserAccount) authentication.getPrincipal();   // ✅ CORRECT

        String email = userAccount.getEmail();                 // ✅ CORRECT


        Doctor doctor = doctorDao.findByUserAccountEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 📄 Fetch medical record
        PatientMedicalRecord record = recordDao.findById(request.getRecordid())
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        // 👤 Fetch patient
        Patient patient = patientDao.findById(request.getPatientid())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // ❗ Ensure record belongs to patient
        if (!Objects.equals(
                record.getPatient().getPatientid(),
                patient.getPatientid()
        )) {
            throw new RuntimeException("Medical record does not belong to this patient");
        }

        // 🧾 Create prescription
        Prescription prescription = new Prescription();
        prescription.setPatientMedicalRecord(record);
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setNotes(request.getNotes());

        prescription = prescriptionDao.save(prescription);

        double totalFees = 0;

        // 💊 Process medicines
        for (PrescriptionLineItemRequest req : request.getMedicines()) {

            MedicineRecord medicine = medicineDao.findById(req.getMedicineid())
                    .orElseThrow(() ->
                            new RuntimeException("Medicine not found"));

            if (medicine.getQuantity() < req.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for medicine: " + medicine.getName());
            }

            // 🔻 Reduce stock
            medicine.setQuantity(
                    medicine.getQuantity() - req.getQuantity());
            medicineDao.save(medicine);

            PrescriptionLineItem item = new PrescriptionLineItem();
            item.setPrescription(prescription);
            item.setMedicine(medicine);
            item.setDosage(req.getDosage());
            item.setDuration(req.getDuration());
            item.setQuantity(req.getQuantity());
            item.setUnitPrice(medicine.getPrice());

            double lineTotal = medicine.getPrice() * req.getQuantity();
            item.setLineTotal(lineTotal);

            totalFees += lineTotal;

            lineItemDao.save(item);
        }

        // 💰 Update prescription total
        prescription.setMedicineFees(totalFees);
        prescriptionDao.save(prescription);

        // 🧾 Auto-generate invoice
        invoiceService.generateInvoiceFromPrescription(prescription);

        return mapToResponse(prescription);
    }


    // ================= PATIENT → MY PRESCRIPTIONS =================
    @Override
    public List<PrescriptionResponse> getMyPrescriptions(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token missing");
        }

        String token = authHeader.substring(7);
        String email = jwtTokenUtil.extractEmail(token);

        UserAccount user = userAccountDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return prescriptionDao.findByPatient_Patientid(patient.getPatientid())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }




    // ================= GET HISTORY BY PATIENT =================
    @Override
    public List<PrescriptionResponse> getPrescriptionsByPatientName(String patientName) {

        // 🔐 1) Get logged-in doctor from SecurityContext
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Doctor doctor = doctorDao.findByUserAccountEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 👤 2) Get patient(s) by name
        List<Patient> patients =
                patientDao.findByFirstnameIgnoreCase(patientName);

        if (patients.isEmpty()) {
            throw new RuntimeException(
                    "No patient found with name: " + patientName);
        }

        // 📄 3) Fetch prescriptions ONLY for this doctor
        return patients.stream()
                .flatMap(patient ->
                        prescriptionDao
                                .findByPatient_PatientidAndDoctor_Doctorid(
                                        patient.getPatientid(),
                                        doctor.getDoctorid()
                                )
                                .stream()
                )
                .map(this::mapToResponse)
                .toList();
    }


    // ================= MANAGER → ALL =================
    @Override
    public List<PrescriptionResponse> getAllPrescriptions() {

        return prescriptionDao.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    // ================= MAPPER =================
    private PrescriptionResponse mapToResponse(Prescription prescription) {

        PrescriptionResponse res = new PrescriptionResponse();
        res.setPrescriptionid(prescription.getPrescriptionid());
        if (prescription.getPatientMedicalRecord() != null) {
            res.setRecordId(
                    prescription.getPatientMedicalRecord().getRecordid()
            );
        }

        res.setPatientId(prescription.getPatient().getPatientid());
        res.setDoctorName(prescription.getDoctor().getName());
        res.setNotes(prescription.getNotes());
        res.setTotalMedicineFees(prescription.getMedicineFees());

        List<PrescriptionMedicineResponse> medicines =
                lineItemDao.findByPrescription_Prescriptionid(
                                prescription.getPrescriptionid())
                        .stream()
                        .map(item -> {
                            PrescriptionMedicineResponse m = new PrescriptionMedicineResponse();
                            m.setMedicineName(item.getMedicine().getName());
                            m.setDosage(item.getDosage());
                            m.setDuration(item.getDuration());
                            m.setQuantity(item.getQuantity());
                            m.setUnitPrice(item.getUnitPrice());
                            m.setLineTotal(item.getLineTotal());
                            return m;
                        })
                        .toList();

        res.setMedicines(medicines);
//        double totalFees = medicines.stream()
//                .mapToDouble(PrescriptionMedicineResponse::getLineTotal)
//                .sum();
//        res.setTotalMedicineFees(totalFees);
        return res;
    }




    @Override
    public PrescriptionResponse getByPrescriptionId(int prescriptionId) {

        Prescription prescription = prescriptionDao.findById(prescriptionId)
                .orElseThrow(() ->
                        new RuntimeException("Prescription not found"));

        return mapToResponse(prescription);
    }

    // ================= DOCTOR → MY ALL PRESCRIPTIONS =================
    @Override
    public List<PrescriptionResponse> getPrescriptionsForLoggedInDoctor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserAccount)) {
            throw new RuntimeException("Unauthorized");
        }

        UserAccount userAccount =
                (UserAccount) authentication.getPrincipal();

        Doctor doctor = doctorDao.findByUserAccountEmail(userAccount.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return prescriptionDao
                .findByDoctor_Doctorid(doctor.getDoctorid())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



}