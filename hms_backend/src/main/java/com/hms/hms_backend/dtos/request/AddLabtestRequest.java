package com.hms.hms_backend.dtos.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AddLabtestRequest {
    private String testName;
    private String description;
    private MultipartFile image;
    private double labTestFees;
}
