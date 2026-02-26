package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class AddPaymentRequest {

    private int invoiceid;
    private double totalamount;
    private String paymentmethod;   // UPI / CARD / CASH
    private String transactionref;
}
