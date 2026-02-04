package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class UpdatePatientMedicalRecordRequest {

    private String diagnosis;
    private String treatmentPlan;
    private Integer testId; // optional
}