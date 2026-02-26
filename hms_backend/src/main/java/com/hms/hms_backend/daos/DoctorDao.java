package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.entities.DoctorStatus;
import com.hms.hms_backend.entities.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface DoctorDao extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByName(String name);
    Optional<Doctor> findByUserAccount(UserAccount userAccount);
    Optional<Doctor> findByUserAccountEmail(String email);
    List<Doctor> findBySpecialityAndStatus(String speciality, DoctorStatus status);
    List<Doctor> findByStatus(
            DoctorStatus status
    );

}