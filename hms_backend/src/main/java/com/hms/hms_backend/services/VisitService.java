package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.CreateVisitRequest;
import com.hms.hms_backend.dtos.request.UpdateVisitStatusRequest;
import com.hms.hms_backend.dtos.response.VisitResponse;

import java.util.List;

public interface VisitService {

    VisitResponse createVisit(CreateVisitRequest request);

    List<VisitResponse> getMyVisitsAsDoctor();

    VisitResponse updateVisitStatus(int visitId, UpdateVisitStatusRequest request);

    List<VisitResponse> getAllVisitsForManager();

}