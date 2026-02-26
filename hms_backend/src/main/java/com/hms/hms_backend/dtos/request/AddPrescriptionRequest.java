package com.hms.hms_backend.dtos.request;

import lombok.Data;

import java.util.List;

@Data
public class AddPrescriptionRequest {

    private int recordid;
    private int patientid;
    private int doctorid;
    private String notes;
    // 👇 REAL PRESCRIPTION DATA
    private List<PrescriptionLineItemRequest> medicines;
}
