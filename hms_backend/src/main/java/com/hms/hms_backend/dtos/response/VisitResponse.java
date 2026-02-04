package com.hms.hms_backend.dtos.response;

import com.hms.hms_backend.entities.VisitStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class VisitResponse {
    private int visitId;
    private LocalDateTime visitDate;
    private String visitType;
    private String reason;
    private VisitStatus status;

    private String patientName;
    private String doctorName;
    private Integer appointmentId;
}