package com.hms.hms_backend.dtos.response;

import lombok.Data;

@Data
public class InvoiceItemResponse {

    private String itemType;
    private String description;
    private double unitPrice;
    private int quantity;
    private double lineTotal;
}

