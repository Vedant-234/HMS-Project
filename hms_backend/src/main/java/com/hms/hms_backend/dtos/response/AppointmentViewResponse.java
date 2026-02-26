package com.hms.hms_backend.dtos.response;

import com.hms.hms_backend.entities.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointmentViewResponse {

    private Integer appointmentId;
    private String doctorName;
    private LocalDateTime scheduledAt;
    private AppointmentStatus status;
}