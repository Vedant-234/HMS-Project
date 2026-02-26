package com.hms.hms_backend.dtos.response;

import lombok.Data;

@Data
public class PrescriptionMedicineResponse {
    private String medicineName;
    private String dosage;
    private String duration;
    private int quantity;
    private double unitPrice;
    private double lineTotal;
}