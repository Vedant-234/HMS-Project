package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.entities.Patient;
import com.hms.hms_backend.entities.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitDao extends JpaRepository<Visit, Integer> {

    List<Visit> findByPatient(Patient patient);

    List<Visit> findByDoctor(Doctor doctor);

    List<Visit> findByDoctorAndVisitDateBetween(Doctor doctor, LocalDateTime start, LocalDateTime end);

    List<Visit> findByVisitDateBetween(LocalDateTime start, LocalDateTime end);
}