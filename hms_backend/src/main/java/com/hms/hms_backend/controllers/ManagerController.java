package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.DoctorStatusRequest;
import com.hms.hms_backend.dtos.request.RegisterDoctorRequest;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.dtos.response.DoctorStatusResponse;
import com.hms.hms_backend.services.AuthService;
import com.hms.hms_backend.services.DoctorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manager")
@CrossOrigin
public class ManagerController {

    private final AuthService authService;
    private final DoctorService doctorService;

    public ManagerController(AuthService authService,DoctorService doctorService) {
        this.authService = authService;
        this.doctorService = doctorService;
    }

    // 👨‍⚕️ MANAGER REGISTERS DOCTOR
    @PostMapping("/register/doctor")
    public ResponseEntity<AuthResponse> registerDoctor(
            @RequestBody RegisterDoctorRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(
                authService.registerDoctor(request, httpRequest)
        );
    }


    @PutMapping("/doctors/{doctorId}/status")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<DoctorStatusResponse> updateDoctorStatus(
            @PathVariable Integer doctorId,
            @RequestBody @Valid DoctorStatusRequest request) {

        return ResponseEntity.ok(
                doctorService.updateDoctorStatus(doctorId, request)
        );
    }
}