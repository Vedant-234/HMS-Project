package com.hms.hms_backend.dtos.response;

import com.hms.hms_backend.entities.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentStatusResponse {
    private AppointmentStatus status;
}