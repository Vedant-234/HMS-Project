package com.hms.hms_backend.dtos.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class AddMedicineRequest {
    private String name;
    private String type;
    private MultipartFile image;
    private int quantity;
    private double price;
    private LocalDate expiryDate;
}
