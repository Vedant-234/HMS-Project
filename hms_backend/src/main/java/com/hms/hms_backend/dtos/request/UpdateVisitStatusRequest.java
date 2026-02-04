package com.hms.hms_backend.dtos.request;

import com.hms.hms_backend.entities.VisitStatus;
import lombok.Data;

@Data
public class UpdateVisitStatusRequest {
    private VisitStatus status;
}