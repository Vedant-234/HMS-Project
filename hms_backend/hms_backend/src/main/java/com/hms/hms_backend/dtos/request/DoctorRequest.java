package com.hms.hms_backend.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDoctorRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String speciality;

    @NotBlank
    private String mobile;

    @Min(5)
    private int consultationDuration;

    // getters & setters
}
