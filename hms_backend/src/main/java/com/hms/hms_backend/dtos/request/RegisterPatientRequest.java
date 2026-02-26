package com.hms.hms_backend.dtos.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterPatientRequest {
    private String email;
    private String password;
    private String firstname;
    private String lastname;
    private String gender;
    private LocalDate dateOfBirth;
    private String mobile;
    private String address;
}