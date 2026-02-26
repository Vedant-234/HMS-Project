package com.hms.hms_backend.dtos.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DoctorScheduleResponse {
    private int appointmentId;
    private int patientId;
    private String patientName;
    private LocalDateTime scheduledAt;
    private String status;

}
