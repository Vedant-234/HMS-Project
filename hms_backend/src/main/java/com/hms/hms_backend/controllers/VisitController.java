package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.CreateVisitRequest;
import com.hms.hms_backend.dtos.request.UpdateVisitStatusRequest;
import com.hms.hms_backend.dtos.response.ApiResponse;
import com.hms.hms_backend.dtos.response.VisitResponse;
import com.hms.hms_backend.services.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visits")
public class VisitController {

    @Autowired
    private VisitService visitService;

    // ✅ Doctor creates visit
    @PostMapping("/doctor/create")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<VisitResponse>> createVisit(@RequestBody CreateVisitRequest request) {
        VisitResponse response = visitService.createVisit(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Visit created successfully", response));
    }

    // ✅ Doctor view my visits
    @GetMapping("/doctor/my-visits")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<VisitResponse>>> myVisitsDoctor() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Visits fetched successfully", visitService.getMyVisitsAsDoctor())
        );
    }

    // ✅ Doctor/Manager update visit status
    @PutMapping("/{visitId}/status")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<VisitResponse>> updateStatus(
            @PathVariable int visitId,
            @RequestBody UpdateVisitStatusRequest request
    ) {
        VisitResponse updated = visitService.updateVisitStatus(visitId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Visit status updated", updated));
    }

    // ✅ Manager view all visits
    @GetMapping("/manager/all")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<VisitResponse>>> managerViewAllVisits() {

        List<VisitResponse> visits = visitService.getAllVisitsForManager();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "All visits fetched successfully", visits)
        );
    }

}