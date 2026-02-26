package com.hms.hms_backend.controllers;


import com.hms.hms_backend.dtos.request.AddMedicineRequest;
import com.hms.hms_backend.dtos.request.UpdateMedicineRequest;
import com.hms.hms_backend.dtos.response.MedicineStockResponse;
import com.hms.hms_backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager")
@CrossOrigin
public class MedicineRecordController {

    private final AuthService authService;

    public MedicineRecordController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/addmedicine",
            consumes = "multipart/form-data"
    )
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> addMedicine(@ModelAttribute AddMedicineRequest request) {

        try {
            authService.addMedicine(request);   // ✅ managerId removed
            return ResponseEntity.ok("Medicine added successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


 // View all medicine with Stock,knowing how much medicine I have in my stock
 @GetMapping("/medicines")
 public ResponseEntity<?> getAllMedicines() {
     return ResponseEntity.ok(authService.getAllMedicines());
 }


 //Search Medicine by Name api

    @GetMapping("/medicine/search")
    public ResponseEntity<?> searchMedicineByName(
            @RequestParam String name) {

        List<MedicineStockResponse> result =
                authService.searchMedicineByName(name);

        if (result.isEmpty()) {
            return ResponseEntity.ok("No medicine found");
        }

        return ResponseEntity.ok(result);
    }

    //Search medicine by id api
    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<?> searchMedicineById(@PathVariable int medicineId) {
        try {
            return ResponseEntity.ok(
                    authService.searchMedicineStockById(medicineId)
            );
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/medicine/{medicineId}")
    public ResponseEntity<?> deleteMedicine(
            @PathVariable int medicineId) {

        try {
            authService.deleteMedicineById(medicineId);
            return ResponseEntity.ok("Medicine deleted successfully");

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/medicine/{medicineId}")
    public ResponseEntity<?> updateMedicine(
            @PathVariable int medicineId,
            @RequestBody UpdateMedicineRequest request) {

        try {
            authService.updateMedicine(medicineId, request);
            return ResponseEntity.ok("Medicine Updated Successfully");

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/medicine/{medicineId}/history")
    public ResponseEntity<?> getHistory(@PathVariable int medicineId) {

        return ResponseEntity.ok(
                authService.getMedicineHistory(medicineId)
        );
    }

    //All History Seen by at a time

    @GetMapping("/medicine/history")
    public ResponseEntity<?> getAllHistory() {

        return ResponseEntity.ok(
                authService.getAllMedicineHistory()
        );
    }

}