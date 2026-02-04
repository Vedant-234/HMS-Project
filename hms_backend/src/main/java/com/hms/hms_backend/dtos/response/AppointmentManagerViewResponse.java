package com.hms.hms_backend.dtos.response;

import com.hms.hms_backend.entities.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointmentManagerViewResponse {

    private int appointmentId;
    private LocalDateTime scheduledAt;
    private String patientName;
    private String doctorName;
    private String notes;
    private AppointmentStatus status;
}