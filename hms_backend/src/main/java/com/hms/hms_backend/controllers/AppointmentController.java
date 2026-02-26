package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.AssignDoctorRequest;
import com.hms.hms_backend.dtos.request.BookAppointmentRequest;
import com.hms.hms_backend.dtos.response.*;
import com.hms.hms_backend.entities.Appointment;
import com.hms.hms_backend.entities.AppointmentStatus;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.AppointmentService;
import com.hms.hms_backend.daos.PatientDao;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtTokenUtil jwtTokenUtil;
    private final PatientDao patientDao;

    public AppointmentController(
            AppointmentService appointmentService,
            JwtTokenUtil jwtTokenUtil,
            PatientDao patientDao) {

        this.appointmentService = appointmentService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.patientDao = patientDao;
    }


    // BOOK APPOINTMENT (PATIENT)
    @PostMapping("/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentStatusResponse>> bookAppointment(
            @RequestBody BookAppointmentRequest request
    ) {
        AppointmentStatusResponse response =
                appointmentService.bookAppointment(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Appointment booked successfully",
                        response
                )
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<AppointmentViewResponse>>> myAppointments() {

        List<AppointmentViewResponse> appointments =
                appointmentService.getMyAppointments();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Appointments fetched successfully",
                        appointments
                )
        );
    }

    @PutMapping("/cancel/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentStatus>> cancelAppointment(
            @PathVariable int appointmentId
    ) {
        appointmentService.cancelAppointment(appointmentId);

        return ResponseEntity.ok(
                ApiResponse.success("Appointment cancelled successfully", AppointmentStatus.CANCELLED)
        );
    }

    @PutMapping("/complete/{appointmentId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentStatus>> completeAppointment(
            @PathVariable int appointmentId) {
        appointmentService.completeAppointment(appointmentId);
        return ResponseEntity.ok(
                ApiResponse.success("Appointment completed successfully", AppointmentStatus.ATTENDED)
        );
    }

    // 👨‍⚕️ Doctor views his appointments
    @GetMapping("doctor/my")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<AppointmentDoctorViewResponse>>> getMyAppointments() {

        List<AppointmentDoctorViewResponse> appointments =
                appointmentService.getDoctorAppointments();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Appointments fetched successfully",
                        appointments
                )
        );
    }


    // 👨‍💼 Manager views all appointments
    @GetMapping("manager/all")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<AppointmentManagerViewResponse>>> viewAllAppointments() {

        List<AppointmentManagerViewResponse> appointments =
                appointmentService.getAllAppointmentsForManager();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "All appointments fetched successfully",
                        appointments
                )
        );
    }

    @GetMapping("/manager/available-doctors/{appointmentId}")
    public ResponseEntity<ApiResponse<List<AvailableDoctorResponse>>> getAvailableDoctors(
            @PathVariable int appointmentId
    ) {
        try {
            List<AvailableDoctorResponse> doctors =
                    appointmentService.getAvailableDoctorsForAppointment(appointmentId);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Available doctors fetched successfully", doctors)
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        }
    }

    @PostMapping("/manager/assign-doctor")
    public ResponseEntity<ApiResponse<AssignDoctorResponse>> assignDoctor(
            @RequestBody AssignDoctorRequest request
    ) {
        try {
            AssignDoctorResponse response = appointmentService.assignAnotherDoctor(request);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Doctor assigned successfully", response)
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        }
    }

}