package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.*;
import com.hms.hms_backend.dtos.response.InvoiceItemResponse;
import com.hms.hms_backend.dtos.response.InvoiceResponse;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.InvoiceService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceDao invoiceDao;
    private final InvoiceLineItemDao itemDao;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserAccountDao userAccountDao;

    private final PatientDao patientDao;
    private final InvoiceLineItemDao invoiceLineItemDao;

    private final PrescriptionLineItemDao prescriptionLineItemDao;

    private static final double MEDICINE_GST_PERCENT = 5.0;


    public InvoiceServiceImpl(
            InvoiceDao invoiceDao,
            InvoiceLineItemDao itemDao,
            JwtTokenUtil jwtTokenUtil,
            UserAccountDao userAccountDao,
            PatientDao patientDao,
            InvoiceLineItemDao invoiceLineItemDao,
            PrescriptionLineItemDao prescriptionLineItemDao) {

        this.invoiceDao = invoiceDao;
        this.itemDao = itemDao;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userAccountDao = userAccountDao;
        this.patientDao = patientDao;
        this.invoiceLineItemDao = invoiceLineItemDao;
        this.prescriptionLineItemDao = prescriptionLineItemDao;

    }

    // ================= PATIENT -> MY INVOICE =================
    @Override
    public List<InvoiceResponse> getMyInvoices(HttpServletRequest request) {

        String email = jwtTokenUtil.getEmailFromRequest(request);

        UserAccount user = userAccountDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return invoiceDao.findByPatient_Patientid(patient.getPatientid())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= DOCTOR =================
    @Override
    public List<InvoiceResponse> searchInvoicesByPatientName(String name) {

        return invoiceDao.searchByPatientName(name)
                .stream().map(this::mapToResponse).toList();
    }

    // ================= MANAGER -> View All Invoice=================
    @Override
    public List<InvoiceResponse> getAllInvoices() {

        return invoiceDao.findAll()
                .stream().map(this::mapToResponse).toList();
    }

    // ================= MAPPER =================

    private InvoiceResponse mapToResponse(Invoice invoice) {

        InvoiceResponse res = new InvoiceResponse();

        res.setInvoiceId(invoice.getInvoiceid());
        res.setPaymentStatus(invoice.getPaymentStatus().name());
        res.setSubtotal(invoice.getSubtotal());
        res.setGstAmount(invoice.getGstamount());
        res.setNettotal(invoice.getNettotal());
        res.setCreatedAt(invoice.getCreatedAt());

        // PATIENT (always exists)
        if (invoice.getPatient() != null) {
            res.setPatientName(
                    invoice.getPatient().getFirstname() + " " +
                            invoice.getPatient().getLastname()
            );
        }

        // DOCTOR (only if prescription exists)
        if (invoice.getPrescription() != null) {
            res.setDoctorName(
                    invoice.getPrescription().getDoctor().getName()
            );
            res.setDoctorFees(invoice.getDoctorFees());
            res.setMedicineFees(invoice.getMedicineFees());
        } else {
            res.setDoctorName("N/A");
            res.setDoctorFees(0);
            res.setMedicineFees(0);
        }


        // LABTEST (only if exists)
        if (invoice.getLabtestResult() != null) {
            res.setLabtestFees(invoice.getLabtestFees());
        } else {
            res.setLabtestFees(0);
        }


        return res;
    }



    // ================= Generating Invoice After Prescription =================

    @Override
    public void generateInvoiceFromPrescription(Prescription prescription) {

        Patient patient = prescription.getPatient();

        // Check existing unpaid invoice
        Invoice invoice =
                invoiceDao.findByPatient_PatientidAndPaymentStatus(
                        patient.getPatientid(),
                        PaymentStatus.UNPAID
                ).orElse(new Invoice());

        invoice.setPatient(patient);
        invoice.setPrescription(prescription);

        // Calculate medicine fees
        double medicineFees =
                prescriptionLineItemDao.findByPrescription_Prescriptionid(
                                prescription.getPrescriptionid()
                        ).stream()
                        .mapToDouble(PrescriptionLineItem::getLineTotal)
                        .sum();

        invoice.setMedicineFees(medicineFees);

        // ️ Doctor fees
        double doctorFees = prescription.getDoctor().getDoctorConsultationFee();
        invoice.setDoctorFees(doctorFees);

        // Subtotal
        double subtotal =
                doctorFees
                        + medicineFees
                        + invoice.getLabtestFees();

        double gstamount = (medicineFees * MEDICINE_GST_PERCENT)/100;

        invoice.setSubtotal(subtotal);
        invoice.setGstamount(gstamount);
        invoice.setNettotal(subtotal + gstamount);
        invoice.setPaymentStatus(PaymentStatus.UNPAID);

        invoiceDao.save(invoice);

        // Invoice line items
        createLineItemsForPrescription(invoice, prescription);
    }

//    Prescription Line Items Details in chunk way breakup

    private void createLineItemsForPrescription(
            Invoice invoice,
            Prescription prescription) {

        for (PrescriptionLineItem item :
                prescriptionLineItemDao.findByPrescription_Prescriptionid(
                        prescription.getPrescriptionid())) {

            InvoiceLineItem li = new InvoiceLineItem();
            li.setInvoice(invoice);
            li.setItemtype("MEDICINE");
            li.setItemrefid(item.getMedicine().getMedicineid());
            li.setDescription(item.getMedicine().getName());
            li.setUnitprice(item.getUnitPrice());
            li.setQuantity(item.getQuantity());
            li.setLinetotal(item.getLineTotal());

            invoiceLineItemDao.save(li);
        }
    }


    // ================= GENERATING INVOICE AFTER LABTEST DONE=================

    @Override
    public void generateInvoiceFromLabtest(LabtestResult result) {

        Patient patient =
                result.getPatientMedicalRecord().getPatient();

        Invoice invoice =
                invoiceDao.findByPatient_PatientidAndPaymentStatus(
                        patient.getPatientid(),
                        PaymentStatus.UNPAID
                ).orElse(new Invoice());

        invoice.setPatient(patient);
        invoice.setLabtestResult(result);
        invoice.setLabtestFees(result.getLabTestFees());

        double subtotal =
                invoice.getDoctorFees()
                        + invoice.getMedicineFees()
                        + invoice.getLabtestFees();

        double gstamount = (invoice.getMedicineFees() * MEDICINE_GST_PERCENT)/100;

        invoice.setSubtotal(subtotal);
        invoice.setGstamount(gstamount);
        invoice.setNettotal(subtotal+gstamount);
        invoice.setPaymentStatus(PaymentStatus.UNPAID);

        invoiceDao.save(invoice);

        createLineItemForLabtest(invoice, result);
    }

    //    Labtest Line Items Details in chunk way breakup

    private void createLineItemForLabtest(
            Invoice invoice,
            LabtestResult result) {

        InvoiceLineItem li = new InvoiceLineItem();
        li.setInvoice(invoice);
        li.setItemtype("LABTEST");
        li.setItemrefid(result.getLabid());
        li.setDescription(result.getLabtest().getTestName());
        li.setUnitprice(result.getLabTestFees());
        li.setQuantity(1);
        li.setLinetotal(result.getLabTestFees());

        invoiceLineItemDao.save(li);
    }



}
