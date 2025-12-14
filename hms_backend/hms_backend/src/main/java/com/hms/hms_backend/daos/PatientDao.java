package com.hms.hms_backend.daos;


import com.hms.hms_backend.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientDao extends JpaRepository<Patient, Integer> {
}