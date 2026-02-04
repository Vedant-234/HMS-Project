package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.AddLabtestResultRequest;
import com.hms.hms_backend.dtos.response.LabtestResultResponse;

import java.util.List;

public interface LabtestResultService {

    LabtestResultResponse addResult(AddLabtestResultRequest request);

    List<LabtestResultResponse> getAllResults();

    List<LabtestResultResponse> getResultsForLoggedInPatient();
}