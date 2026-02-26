package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Appointment;
import com.hms.hms_backend.entities.AppointmentStatus;
import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentDao extends JpaRepository<Appointment, Integer> {

    boolean existsByDoctorAndScheduledAt(
            Doctor doctor,
            LocalDateTime scheduledAt
    );

    List<Appointment> findByPatient(Patient patient);

    Optional<Appointment> findByAppointmentIdAndPatient(
            int appointmentId,
            Patient patient
    );

    List<Appointment> findByStatusAndScheduledAtLessThanEqual(
            AppointmentStatus status,
            LocalDateTime time
    );

    Optional<Appointment> findByAppointmentIdAndDoctor(
            int appointmentId,
            Doctor doctor
    );

    List<Appointment> findByDoctor(Doctor doctor);

    List<Appointment> findAllByOrderByScheduledAtDesc();
}