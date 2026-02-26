package com.hms.hms_backend.dtos.response;

import lombok.Data;

import java.util.List;

@Data
public class PrescriptionResponse {

    private int prescriptionid;
    private int recordId;
    private int patientId;
    private String doctorName;
    private String notes;
    private double totalMedicineFees;

    //  medicines + dosage + duration
    private List<PrescriptionMedicineResponse> medicines;
}