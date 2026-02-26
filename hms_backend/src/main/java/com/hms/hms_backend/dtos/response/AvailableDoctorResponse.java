package com.hms.hms_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AvailableDoctorResponse {
    private int doctorId;
    private String doctorName;
    private String speciality;
    private String mobile;
}