package com.hms.hms_backend.repo;

import com.hms.hms_backend.entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepository extends JpaRepository<Manager, Integer> {
    // Custom query example
    //Manager findByUser_Userid(int userid);
}
