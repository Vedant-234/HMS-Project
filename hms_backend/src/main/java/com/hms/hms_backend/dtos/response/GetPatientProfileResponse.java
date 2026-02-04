package com.hms.hms_backend.dtos.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class GetPatientProfileResponse {
    private int patientid;
    private String firstname;
    private String lastname;
    private String gender;
    private LocalDate dateOfBirth;
    private String mobile;
    private String address;

    // from UserAccount
    private String email;
}
