package com.hms.hms_backend.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String speciality;

    @NotBlank
    private String mobile;

    @Min(5)
    private int consultationDuration;


}