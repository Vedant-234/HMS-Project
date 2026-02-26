package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.DoctorRequest;
import com.hms.hms_backend.dtos.response.ApiResponse;
import com.hms.hms_backend.dtos.response.DoctorResponse;
import com.hms.hms_backend.entities.DoctorStatus;
import com.hms.hms_backend.services.AuthService;
import com.hms.hms_backend.services.DoctorService;
import com.hms.hms_backend.servicesImpl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
@CrossOrigin
public class DoctorController {

    //Service
    private final AuthService authService;
    private final DoctorService doctorService;

    //Service constructor
    public DoctorController(AuthService authService, DoctorService doctorService) {
        this.authService = authService;
        this.doctorService = doctorService;
    }

    //When doctor prescribe the medicine to the patient that time to doctor call this api and stock will be updated

    @PostMapping("/medicine/reduce/{medicineId}/{qty}")
    public ResponseEntity<?> reduceStock(
            @PathVariable int medicineId,
            @PathVariable int qty) {

        try {
            authService.reduceMedicineStock(medicineId, qty);
            return ResponseEntity.ok("Stock updated");

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ✅ 🔍 GET DOCTORS BY STATUS (MANAGER / PATIENT)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('MANAGER','PATIENT')")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctorsByStatus(
            @PathVariable DoctorStatus status
    ) {

        List<DoctorResponse> doctors = doctorService.getDoctorsByStatus(status);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctors fetched successfully", doctors)
        );
    }

    // ✅ 👨‍⚕️ GET LOGGED-IN DOCTOR PROFILE
    @GetMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorResponse>> getProfile(HttpServletRequest request) {

        DoctorResponse profile = doctorService.getLoggedInDoctorProfile(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctor profile fetched successfully", profile)
        );
    }

    // ✅ ✏️ UPDATE LOGGED-IN DOCTOR PROFILE
    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateProfile(
            @RequestBody DoctorRequest doctorRequest,
            HttpServletRequest request
    ) {

        DoctorResponse updated = doctorService.updateMyProfile(doctorRequest, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctor profile updated successfully", updated)
        );
    }

    // ✅ 🔍 GET DOCTORS BY SPECIALITY (PATIENT / MANAGER)
    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','PATIENT')")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctorsBySpeciality(
            @RequestParam String speciality
    ) {

        List<DoctorResponse> doctors = doctorService.getDoctorsBySpeciality(speciality);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctors fetched successfully", doctors)
        );
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctorsBySpecialityPublic(
            @RequestParam String speciality
    ) {
        List<DoctorResponse> doctors =
                doctorService.getDoctorsBySpeciality(speciality);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctors fetched successfully", doctors)
        );
    }
}