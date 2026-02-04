package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class RegisterDoctorRequest {
    private String name;
    private Double doctorConsultationFee;
    private String gender;
    private String speciality;
    private String mobile;
    private int consultationDuration;
    private String email;
    private String password;   // doctor login password
}