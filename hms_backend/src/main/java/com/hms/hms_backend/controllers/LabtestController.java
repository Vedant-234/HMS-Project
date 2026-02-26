package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.AddLabtestRequest;
import com.hms.hms_backend.dtos.request.UpdateLabtestRequest;
import com.hms.hms_backend.services.LabtestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/labtest")
@CrossOrigin
public class LabtestController {

    private final LabtestService labtestService;

    public LabtestController(LabtestService labtestService) {
        this.labtestService = labtestService;
    }

    // ✅ MANAGER ADD LABTEST
    @PostMapping(value = "/addlabtest", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> addLabtest(@ModelAttribute AddLabtestRequest request) {

        labtestService.addLabtest(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Lab test added successfully");
    }

    // ✅ VIEW ALL LABTESTS (PUBLIC / PATIENT / MANAGER)
    @GetMapping
    public ResponseEntity<?> viewAllLabtests() {
        return ResponseEntity.ok(labtestService.getAllLabtests());
    }

    // ✅ SEARCH LABTEST BY NAME
    @GetMapping("/search")
    public ResponseEntity<?> searchLabtest(@RequestParam String name) {
        return ResponseEntity.ok(
                labtestService.searchLabtestByName(name)
        );
    }

    // ✅ MANAGER UPDATE LABTEST
    @PutMapping(value = "/updatelab/{testId}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateLabtest(
            @PathVariable int testId,
            @ModelAttribute UpdateLabtestRequest request) {

        labtestService.updateLabtest(testId, request);
        return ResponseEntity.ok("Lab test updated successfully");
    }

    // ✅ MANAGER DELETE LABTEST
    @DeleteMapping("/deletelab/{testId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> deleteLabtest(@PathVariable int testId) {

        labtestService.deleteLabtest(testId);
        return ResponseEntity.ok("Lab test deleted successfully");
    }
}