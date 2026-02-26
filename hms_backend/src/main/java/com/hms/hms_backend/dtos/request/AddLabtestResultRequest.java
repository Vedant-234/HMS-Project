package com.hms.hms_backend.dtos.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AddLabtestResultRequest {

    private int testid;
    private Integer recordid;
    private LocalDate resultDate;
    private String findings;
    private Double labTestFees;
}