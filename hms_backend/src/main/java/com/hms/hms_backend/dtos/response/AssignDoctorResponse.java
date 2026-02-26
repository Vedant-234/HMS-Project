package com.hms.hms_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssignDoctorResponse {
    private int appointmentId;
    private String oldDoctorName;
    private String newDoctorName;
    private String message;
}