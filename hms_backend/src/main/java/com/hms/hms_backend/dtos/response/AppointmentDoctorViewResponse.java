package com.hms.hms_backend.dtos.response;

import java.time.LocalDateTime;
import com.hms.hms_backend.entities.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentDoctorViewResponse {

    private int appointmentId;
    private LocalDateTime scheduledAt;
    private String patientName;
    private int patientId;
    private String notes;
    private AppointmentStatus status;
}