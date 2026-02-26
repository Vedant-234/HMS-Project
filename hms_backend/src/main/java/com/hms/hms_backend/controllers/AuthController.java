package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.*;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // LOGIN ( for common api)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    //  REGISTER (PATIENT ONLY)
    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponse> registerPatient(
            @RequestBody RegisterPatientRequest request) {
        return ResponseEntity.ok(authService.registerPatient(request));
    }


    @PostMapping("/changepassword")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request) {

        authService.changePassword(request);
        return ResponseEntity.ok("Password changed successfully");
    }

}