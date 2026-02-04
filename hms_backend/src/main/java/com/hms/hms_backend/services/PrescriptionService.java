package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.AddPrescriptionRequest;
import com.hms.hms_backend.dtos.response.PrescriptionResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface PrescriptionService {

    // ADD (Doctor use karega)
    PrescriptionResponse addPrescription(AddPrescriptionRequest request);

    //  PATIENT → apni saari prescriptions
    List<PrescriptionResponse> getMyPrescriptions(HttpServletRequest request);

    // Doctor -> GET PRESCRIPTIONS BY PATIENT NAME
    List<PrescriptionResponse> getPrescriptionsByPatientName(String patientName);

    //  MANAGER / DOCTOR → all prescriptions
    List<PrescriptionResponse> getAllPrescriptions();

    // 🔍 SINGLE prescription (PDF / Detail view ke liye)
    PrescriptionResponse getByPrescriptionId(int prescriptionId);

    List<PrescriptionResponse> getPrescriptionsForLoggedInDoctor();
}