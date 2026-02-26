package com.hms.hms_backend.dtos.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponse {


    private int paymentId;
    private int invoiceId;
    private double amountPaid;
    private String paymentMethod;
    private String transactionRef;
    private String invoiceStatus;
    private LocalDateTime paymentDate;
}