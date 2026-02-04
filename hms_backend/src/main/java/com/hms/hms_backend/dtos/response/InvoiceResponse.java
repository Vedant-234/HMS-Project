package com.hms.hms_backend.dtos.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceResponse {

//    private String patientName;
//    private String doctorName;
//    private double subtotal;
//    private double nettotal;
//    private String paymentStatus;
//    private LocalDateTime createdAt;
//    private List<InvoiceItemResponse> items;

    private int invoiceId;
    private String patientName;
    private double doctorFees;
    private String doctorName;
    private double medicineFees;
    private double labtestFees;
    private double subtotal;
    private double gstAmount;
    private double nettotal;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private Integer prescriptionId; // nullable
    private Integer labId;
}