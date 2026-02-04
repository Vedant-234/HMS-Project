package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.LabtestDao;
import com.hms.hms_backend.daos.LabtestResultDao;
import com.hms.hms_backend.daos.PatientDao;
import com.hms.hms_backend.daos.PatientMedicalRecordDao;
import com.hms.hms_backend.dtos.request.AddLabtestResultRequest;
import com.hms.hms_backend.dtos.response.LabtestResultResponse;
import com.hms.hms_backend.entities.Labtest;
import com.hms.hms_backend.entities.LabtestResult;
import com.hms.hms_backend.entities.PatientMedicalRecord;
import com.hms.hms_backend.services.InvoiceService;
import com.hms.hms_backend.services.LabtestResultService;
import org.springframework.stereotype.Service;
import com.hms.hms_backend.entities.UserAccount;
import org.springframework.security.core.context.SecurityContextHolder;
import com.hms.hms_backend.entities.Patient;

import java.time.LocalDate;
import java.util.List;

@Service
public class LabtestResultServiceImpl implements LabtestResultService {

    private final LabtestResultDao labtestResultDao;
    private final LabtestDao labtestDao;
    private final PatientMedicalRecordDao recordDao;
    private final InvoiceService invoiceService;
    private final PatientDao patientDao;

    public LabtestResultServiceImpl(
            LabtestResultDao labtestResultDao,
            LabtestDao labtestDao,
            PatientMedicalRecordDao recordDao,
            InvoiceService invoiceService,
            PatientDao patientDao) {

        this.labtestResultDao = labtestResultDao;
        this.labtestDao = labtestDao;
        this.recordDao = recordDao;
        this.invoiceService = invoiceService;
        this.patientDao = patientDao;
    }

    // =========================
    // MANAGER → ADD RESULT
    // =========================
    @Override
    public LabtestResultResponse addResult(AddLabtestResultRequest request) {

        // 1️⃣ Validate labtest
        Labtest labtest = labtestDao.findById(request.getTestid())
                .orElseThrow(() -> new RuntimeException("Labtest not found"));

        // 2️⃣ recordId is REQUIRED for invoice generation
        if (request.getRecordid() == null) {
            throw new RuntimeException("Medical record id is required to generate invoice");
        }

        PatientMedicalRecord record = recordDao.findById(request.getRecordid())
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        // 3️⃣ Create labtest result
        LabtestResult result = new LabtestResult();
        result.setLabtest(labtest);
        result.setPatientMedicalRecord(record);
        result.setFindings(request.getFindings());
        result.setLabTestFees(request.getLabTestFees());

        // ✅ Manager-controlled result date
        result.setResultDate(
                request.getResultDate() != null
                        ? request.getResultDate()
                        : LocalDate.now()
        );

        // 4️⃣ Save first (important: labid required)
        LabtestResult savedResult = labtestResultDao.save(result);

        // 5️⃣ Generate / update invoice + line items
        invoiceService.generateInvoiceFromLabtest(savedResult);

        // 6️⃣ Return response
        return mapToResponse(savedResult);
    }

    // =========================
    // MANAGER / DOCTOR → VIEW ALL
    // =========================
    @Override
    public List<LabtestResultResponse> getAllResults() {
        return labtestResultDao.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // PATIENT → VIEW OWN
    // =========================
    @Override
    public List<LabtestResultResponse> getResultsForLoggedInPatient() {

        UserAccount user = (UserAccount)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        Patient patient = patientDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return labtestResultDao
                .findByPatientMedicalRecord_Patient_Patientid(patient.getPatientid())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================
    // ENTITY → DTO
    // =========================
    private LabtestResultResponse mapToResponse(LabtestResult result) {

        LabtestResultResponse response = new LabtestResultResponse();

        response.setLabid(result.getLabid());
        response.setTestName(result.getLabtest().getTestName());
        response.setFindings(result.getFindings());
        response.setLabTestFees(result.getLabTestFees());
        response.setResultDate(result.getResultDate());

        // ✅ THIS IS WHAT WAS MISSING MOST TIMES
        if (result.getPatientMedicalRecord() != null) {
            response.setRecordId(
                    result.getPatientMedicalRecord().getRecordid()
            );
        }

        return response;
    }
}