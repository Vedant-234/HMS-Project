package com.hms.hms_backend.dtos.response;

import lombok.Data;

@Data
public class GetAllLabtestResponse {
    private int testid;
    private String testName;
    private String description;
    private String image;
    private double labTestFees;
}
