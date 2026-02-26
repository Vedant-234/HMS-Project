package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class PrescriptionLineItemRequest {
    private int medicineid;   // medicine_record se
    private String dosage;    // 1-0-1 after food
    private String duration;  // 5 days
    private int quantity;     // total units
}
