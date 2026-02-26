package com.hms.hms_backend.dtos.request;

import com.hms.hms_backend.entities.DoctorStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorStatusRequest {

    @NotNull
    private DoctorStatus status;


}