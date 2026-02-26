package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.*;
import com.hms.hms_backend.dtos.request.CreateVisitRequest;
import com.hms.hms_backend.dtos.request.UpdateVisitStatusRequest;
import com.hms.hms_backend.dtos.response.VisitResponse;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.services.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VisitServiceImpl implements VisitService {

    @Autowired private VisitDao visitDao;
    @Autowired private PatientDao patientDao;
    @Autowired private DoctorDao doctorDao;
    @Autowired private AppointmentDao appointmentDao;

    // ✅ Always get user inside method (NOT at class level)
    private UserAccount getLoggedInUser() {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new RuntimeException("Unauthorized");
        }

        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();


        // If you are storing full UserAccount in principal
        if (principal instanceof UserAccount ua) {
            return ua;
        }

        throw new RuntimeException("Invalid authentication principal");
    }

    // ✅ Convert Visit entity -> response
    private VisitResponse mapToResponse(Visit v) {
        return new VisitResponse(
                v.getVisitid(),
                v.getVisitDate(),
                v.getVisitType(),
                v.getReason(),
                v.getStatus(),
                v.getPatient().getFirstname() + " " + v.getPatient().getLastname(),
                (v.getDoctor() != null) ? v.getDoctor().getName() : null,
                (v.getAppointment() != null) ? v.getAppointment().getAppointmentId() : null
        );
    }

    // ✅ Doctor creates visit
    @Override
    public VisitResponse createVisit(CreateVisitRequest request) {

        UserAccount loggedInUser = getLoggedInUser(); // ✅ here

        Doctor doctor = doctorDao
                .findByUserAccount(loggedInUser)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        Patient patient = patientDao.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentDao.findById(request.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
        }

        Visit visit = new Visit();
        visit.setDoctor(doctor);
        visit.setPatient(patient);
        visit.setAppointment(appointment);
        visit.setVisitDate(LocalDateTime.now());
        visit.setVisitType(request.getVisitType());
        visit.setReason(request.getReason());
        visit.setStatus(VisitStatus.ATTENDED);
        visit.setCreatedAt(LocalDateTime.now());

        Visit saved = visitDao.save(visit);

        return mapToResponse(saved);
    }

    // ✅ Doctor sees own visits
    @Override
    public List<VisitResponse> getMyVisitsAsDoctor() {

        UserAccount loggedInUser = getLoggedInUser(); // ✅ here

        Doctor doctor = doctorDao
                .findByUserAccount(loggedInUser)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        return visitDao.findByDoctor(doctor)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ✅ Update visit status (Doctor/Manager)
    @Override
    public VisitResponse updateVisitStatus(int visitId, UpdateVisitStatusRequest request) {

        UserAccount loggedInUser = getLoggedInUser(); // ✅ here (you can use later to check role)

        Visit visit = visitDao.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        visit.setStatus(request.getStatus());

        Visit updated = visitDao.save(visit);

        return mapToResponse(updated);
    }

    // manager view all appointments
    @Override
    public List<VisitResponse> getAllVisitsForManager() {

        // 🔐 Get logged-in user
        UserAccount loggedInUser = getLoggedInUser();

        // ✅ Only manager should access
        if (loggedInUser.getRole() != UserRole.MANAGER) {
            throw new RuntimeException("Access denied! Only manager can view all visits");
        }

        return visitDao.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

}