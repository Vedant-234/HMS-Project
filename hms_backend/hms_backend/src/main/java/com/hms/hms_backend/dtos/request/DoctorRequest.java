package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class DoctorRequest {
    private String name;
    private String speciality;
    private String mobile;
    private String email;
    private String password;   // doctor login password
}

