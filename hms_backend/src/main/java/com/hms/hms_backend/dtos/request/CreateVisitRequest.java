package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class CreateVisitRequest {
    private int patientId;
    private Integer appointmentId; // optional
    private String visitType;      // OPD / FOLLOWUP / EMERGENCY
    private String reason;
}