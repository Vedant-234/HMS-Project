package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.AddLabtestResultRequest;
import com.hms.hms_backend.dtos.response.LabtestResultResponse;
import com.hms.hms_backend.services.LabtestResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/labtest-result")
@CrossOrigin
public class LabtestResultController {

    private final LabtestResultService labtestResultService;

    public LabtestResultController(LabtestResultService labtestResultService) {
        this.labtestResultService = labtestResultService;
    }

    // =========================
    // MANAGER → ADD RESULT
    // =========================
    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> addResult(
            @RequestBody AddLabtestResultRequest request) {

        return ResponseEntity.ok(
                labtestResultService.addResult(request)
        );
    }

    // =========================
    // MANAGER + DOCTOR → VIEW ALL
    // =========================
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('MANAGER','DOCTOR')")
    public ResponseEntity<?> getAllResults() {

        return ResponseEntity.ok(
                labtestResultService.getAllResults()
        );
    }

    // =========================
    // PATIENT → VIEW OWN
    // =========================
    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<LabtestResultResponse>> getMyResults() {

        return ResponseEntity.ok(
                labtestResultService.getResultsForLoggedInPatient()
        );
    }
}