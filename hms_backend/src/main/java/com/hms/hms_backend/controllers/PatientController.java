package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.UpdatePatientProfileRequest;
import com.hms.hms_backend.dtos.response.GetPatientProfileResponse;
import com.hms.hms_backend.services.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patient")
@CrossOrigin
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // ✅ GET LOGGED-IN PATIENT PROFILE
    @GetMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<GetPatientProfileResponse> getProfile(HttpServletRequest request) {
        return ResponseEntity.ok(
                patientService.getLoggedInPatientProfile(request)
        );
    }

    // ✅ UPDATE LOGGED-IN PATIENT PROFILE
    @PutMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<GetPatientProfileResponse> updateProfile(
            @RequestBody UpdatePatientProfileRequest updateRequest,
            HttpServletRequest request) {

        return ResponseEntity.ok(
                patientService.updateMyProfile(updateRequest, request)
        );
    }
}