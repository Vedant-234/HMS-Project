package com.hms.hms_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientMedicalRecordResponse {

    private int recordId;

    private LocalDateTime currentVisit;
    private LocalDateTime lastVisit;

    private String diagnosis;
    private String treatmentPlan;

    // Patient info
    private Integer patientId;
    private String patientName;

    // Doctor info
    private Integer doctorId;
    private String doctorName;

    // Optional lab test
    private Integer labtestId;
}