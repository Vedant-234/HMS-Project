package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.PatientMedicalRecordRequest;
import com.hms.hms_backend.dtos.request.UpdatePatientMedicalRecordRequest;
import com.hms.hms_backend.dtos.response.PatientMedicalRecordResponse;
import com.hms.hms_backend.services.PatientMedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient-medical-record")
@CrossOrigin
public class PatientMedicalRecordController {

    private final PatientMedicalRecordService service;

    public PatientMedicalRecordController(
            PatientMedicalRecordService service) {
        this.service = service;
    }

    // ================= CREATE =================
    // Doctor creates medical record
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> create(
            @RequestBody PatientMedicalRecordRequest request) {

        service.createRecord(request);
        return ResponseEntity.ok("Medical record created successfully");
    }

    // ================= UPDATE =================
    // Doctor updates diagnosis / treatment
    @PutMapping("/{recordId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> update(
            @PathVariable int recordId,
            @RequestBody UpdatePatientMedicalRecordRequest request) {

        service.updateRecord(recordId, request);
        return ResponseEntity.ok("Medical record updated successfully");
    }


    // ================= DOCTOR VIEW =================
    // Logged-in doctor → view own records
    @GetMapping("/doctor/my-records")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> myRecords() {

        return ResponseEntity.ok(
                service.getRecordsForLoggedInDoctor()
        );
    }

    // ================= MANAGER VIEW =================
    // Manager → view records by doctorId
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> byDoctor(@PathVariable int doctorId) {

        return ResponseEntity.ok(
                service.getRecordsByDoctor(doctorId)
        );
    }

    // ================= MANAGER VIEW (ALL) =================
    // Manager → view all medical records
    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getAllRecords() {

        return ResponseEntity.ok(
                service.getAllRecordsForManager()
        );
    }

    // 👤 PATIENT – VIEW OWN MEDICAL RECORDS
    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<PatientMedicalRecordResponse>> getMyRecords() {

        return ResponseEntity.ok(
                service.getRecordsForLoggedInPatient()
        );
    }
}