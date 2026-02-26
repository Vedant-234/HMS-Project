package com.hms.hms_backend.dtos.request;

import lombok.Data;

@Data
public class UpdateLabtestRequest {
    private String testName;
    private String description;
    private String image;
    private Double labTestFees;
}
