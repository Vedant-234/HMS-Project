package com.hms.hms_backend.daos;


import com.hms.hms_backend.entities.Patient;
import com.hms.hms_backend.entities.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientDao extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByUserAccount(UserAccount userAccount);
    List<Patient> findByFirstnameIgnoreCase(String firstname);
    Optional<Patient> findByUserAccountEmail(String email);
}