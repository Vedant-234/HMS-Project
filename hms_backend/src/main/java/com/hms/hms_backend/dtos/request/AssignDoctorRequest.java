package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class AssignDoctorRequest {
    private int appointmentId;
    private int newDoctorId; // manager selects this doctor
}