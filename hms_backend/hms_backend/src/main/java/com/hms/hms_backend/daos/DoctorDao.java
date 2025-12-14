package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DoctorDao extends JpaRepository<Doctor, Integer> {
}
