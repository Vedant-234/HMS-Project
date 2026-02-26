package com.hms.hms_backend.dtos.response;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class MedicineStockResponse {
    private int medicineid;
    private String name;
    private String type;
    private String image;
    private int quantity;
    private double price;
    private LocalDate expiryDate;
}
