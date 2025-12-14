package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.DoctorRequest;
import com.hms.hms_backend.dtos.request.LoginRequest;
import com.hms.hms_backend.dtos.request.RegisterPatientRequest;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.services.AuthService;
import com.hms.hms_backend.services.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final DoctorService doctorService;

    public AuthController(AuthService authService, DoctorService doctorService) {
        this.authService = authService;
        this.doctorService = doctorService;
    }

    // 🔐 LOGIN (ALL)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // 🧑‍⚕️ REGISTER (PATIENT ONLY)
    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponse> registerPatient(
            @RequestBody RegisterPatientRequest request) {
        return ResponseEntity.ok(authService.registerPatient(request));
    }

    @PostMapping("/create-doctor")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> createDoctor(@RequestBody DoctorRequest request) {
        Doctor doctor = doctorService.createDoctor(request);
        return ResponseEntity.ok(doctor);
    }

}