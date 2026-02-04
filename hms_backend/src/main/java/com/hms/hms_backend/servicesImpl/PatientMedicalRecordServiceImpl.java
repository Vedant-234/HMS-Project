package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.*;
import com.hms.hms_backend.dtos.request.PatientMedicalRecordRequest;
import com.hms.hms_backend.dtos.request.UpdatePatientMedicalRecordRequest;
import com.hms.hms_backend.dtos.response.PatientMedicalRecordResponse;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.services.PatientMedicalRecordService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientMedicalRecordServiceImpl implements PatientMedicalRecordService {

    private final PatientMedicalRecordDao recordDao;
    private final PatientDao patientDao;
    private final DoctorDao doctorDao;
    private final LabtestDao labtestDao;

    public PatientMedicalRecordServiceImpl(
            PatientMedicalRecordDao recordDao,
            PatientDao patientDao,
            DoctorDao doctorDao,
            LabtestDao labtestDao) {

        this.recordDao = recordDao;
        this.patientDao = patientDao;
        this.doctorDao = doctorDao;
        this.labtestDao = labtestDao;
    }

    // ================= CREATE (DOCTOR) =================
    @Override
    public void createRecord(PatientMedicalRecordRequest request) {

        Doctor doctor = getLoggedInDoctor();

        Patient patient = patientDao.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        PatientMedicalRecord record = new PatientMedicalRecord();
        record.setDoctor(doctor);
        record.setPatient(patient);
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatmentPlan(request.getTreatmentPlan());

        if (request.getTestId() != null) {
            Labtest labtest = labtestDao.findById(request.getTestId())
                    .orElseThrow(() -> new RuntimeException("Labtest not found"));
            record.setLabtest(labtest);
        }

        recordDao.save(record);
    }

    // ================= UPDATE (DOCTOR ONLY) =================
    @Override
    public void updateRecord(int recordId, UpdatePatientMedicalRecordRequest request) {

        PatientMedicalRecord record = recordDao.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        Doctor doctor = getLoggedInDoctor();

        Doctor recordDoctor = record.getDoctor();

        if (recordDoctor == null ||
                recordDoctor.getDoctorid() != doctor.getDoctorid()) {

            throw new RuntimeException("You are not authorized to update this record");
        }


        if (request.getDiagnosis() != null) {
            record.setDiagnosis(request.getDiagnosis());
        }

        if (request.getTreatmentPlan() != null) {
            record.setTreatmentPlan(request.getTreatmentPlan());
        }

        if (request.getTestId() != null) {
            Labtest labtest = labtestDao.findById(request.getTestId())
                    .orElseThrow(() -> new RuntimeException("Labtest not found"));
            record.setLabtest(labtest);
        }

        recordDao.save(record);
    }

    // ================= DOCTOR =================
    @Override
    public List<PatientMedicalRecordResponse> getRecordsForLoggedInDoctor() {

        Doctor doctor = getLoggedInDoctor();

        return recordDao.findByDoctor_Doctorid(doctor.getDoctorid())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= PATIENT =================
    @Override
    public List<PatientMedicalRecordResponse> getRecordsForLoggedInPatient() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserAccount)) {
            throw new RuntimeException("Unauthorized");
        }

        UserAccount user = (UserAccount) auth.getPrincipal();

        Patient patient = patientDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        return recordDao.findByPatient_Patientid(patient.getPatientid())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= MANAGER =================
    @Override
    public List<PatientMedicalRecordResponse> getRecordsByDoctor(int doctorId) {

        return recordDao.findByDoctor_Doctorid(doctorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<PatientMedicalRecordResponse> getAllRecordsForManager() {

        return recordDao.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= HELPER =================
    private Doctor getLoggedInDoctor() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserAccount)) {
            throw new RuntimeException("Unauthorized");
        }

        UserAccount user = (UserAccount) auth.getPrincipal();

        return doctorDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
    }

    private PatientMedicalRecordResponse mapToResponse(PatientMedicalRecord r) {

        PatientMedicalRecordResponse dto = new PatientMedicalRecordResponse();

        dto.setRecordId(r.getRecordid());
        dto.setCurrentVisit(r.getCurrentVisit());
        dto.setLastVisit(r.getLastVisit());
        dto.setDiagnosis(r.getDiagnosis());
        dto.setTreatmentPlan(r.getTreatmentPlan());

        if (r.getPatient() != null) {
            dto.setPatientId(r.getPatient().getPatientid());
            dto.setPatientName(
                    r.getPatient().getFirstname() + " " +
                            r.getPatient().getLastname()
            );
        }

        if (r.getDoctor() != null) {
            dto.setDoctorId(r.getDoctor().getDoctorid());
            dto.setDoctorName(r.getDoctor().getName());
        }

        if (r.getLabtest() != null) {
            dto.setLabtestId(r.getLabtest().getTestid());
        }

        return dto;
    }
}