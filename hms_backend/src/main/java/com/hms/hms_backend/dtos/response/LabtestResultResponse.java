package com.hms.hms_backend.dtos.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LabtestResultResponse {

    private Integer labid;
    private String testName;
    private Integer recordId;
    private String findings;
    private Double labTestFees;
    private LocalDate resultDate;
}