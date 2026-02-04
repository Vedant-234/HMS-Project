package com.hms.hms_backend.dtos.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookAppointmentRequest {

    private String doctorName;
    private LocalDateTime scheduledAt;
    private String notes;
}