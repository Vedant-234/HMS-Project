package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.AddPrescriptionRequest;
import com.hms.hms_backend.dtos.response.PrescriptionResponse;
import com.hms.hms_backend.services.PrescriptionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.hms.hms_backend.servicesImpl.PrescriptionPdfServiceImpl;
@RestController
@RequestMapping("/prescription")
@CrossOrigin
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final PrescriptionPdfServiceImpl pdfService;

    public PrescriptionController(PrescriptionService prescriptionService, PrescriptionPdfServiceImpl prescriptionPdfService, PrescriptionPdfServiceImpl pdfService) {
        this.prescriptionService = prescriptionService;
        this.pdfService = pdfService;
    }

    //ADD PRESCRIPTION (Add Doctor Token)
    @PostMapping
    public ResponseEntity<?> addPrescription(
            @Valid @RequestBody AddPrescriptionRequest request) {

        return ResponseEntity.ok(
                prescriptionService.addPrescription(request)
        );
    }

    // GET BY PATIENT NAME
    @GetMapping("/patient")
    public ResponseEntity<?> getByPatientName(
            @RequestParam String name) {

        return ResponseEntity.ok(
                prescriptionService.getPrescriptionsByPatientName(name)
        );
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getMyPrescriptionsAsDoctor() {

        return ResponseEntity.ok(
                prescriptionService.getPrescriptionsForLoggedInDoctor()
        );
    }

    // PATIENT → MY PRESCRIPTIONS
    @GetMapping("/my")
    public ResponseEntity<?> myPrescriptions(HttpServletRequest request) {
        return ResponseEntity.ok(
                prescriptionService.getMyPrescriptions(request)
        );
    }




    //MANAGER -> ALL PRESCRIPTIONS
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(
                prescriptionService.getAllPrescriptions()
        );
    }




    //Get the Pdf document
    @GetMapping("/{prescriptionId}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable int prescriptionId) {

        PrescriptionResponse response =
                prescriptionService.getByPrescriptionId(prescriptionId);

        byte[] pdf = pdfService.generatePdf(response);

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=prescription.pdf")
                .body(pdf);
    }


}