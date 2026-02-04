package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.AddLabtestRequest;
import com.hms.hms_backend.dtos.request.UpdateLabtestRequest;
import com.hms.hms_backend.dtos.response.GetAllLabtestResponse;

import java.util.List;

public interface LabtestService {

    //Add the labtest method
    void addLabtest(AddLabtestRequest request);

    //Getting all labtest record
    List<GetAllLabtestResponse> getAllLabtests();

    //Getting Labtest Record By Test Name
    List<GetAllLabtestResponse> searchLabtestByName(String name);

    //Update Labtest Record when get field from frontend that field upadted service method
    void updateLabtest(int testId, UpdateLabtestRequest request);

    //Delete the labtest record
    void deleteLabtest(int testId);

}