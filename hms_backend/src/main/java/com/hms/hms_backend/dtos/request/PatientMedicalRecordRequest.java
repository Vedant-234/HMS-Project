package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class PatientMedicalRecordRequest {
    private int patientId;
    private int doctorId;
    private Integer testId;   // optional

    private String diagnosis;
    private String treatmentPlan;
}
