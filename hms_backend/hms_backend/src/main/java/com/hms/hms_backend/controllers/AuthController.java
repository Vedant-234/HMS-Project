package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.RegisterDoctorRequest;
import com.hms.hms_backend.dtos.request.LoginRequest;
import com.hms.hms_backend.dtos.request.RegisterPatientRequest;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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

    @PostMapping("/register/doctor/{managerId}")
    public ResponseEntity<AuthResponse> registerDoctor(@PathVariable int managerId,@RequestBody RegisterDoctorRequest request) {
        return ResponseEntity.ok(authService.registerDoctor(request,managerId));
    }



}