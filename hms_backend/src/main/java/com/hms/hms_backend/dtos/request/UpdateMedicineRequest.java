package com.hms.hms_backend.dtos.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMedicineRequest {
    private String name;
    private String type;
    private String image;
    private Integer quantity;
    private Double price;
    private LocalDate expiryDate;
}
