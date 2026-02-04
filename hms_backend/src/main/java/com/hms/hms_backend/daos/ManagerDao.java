package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Manager;
import com.hms.hms_backend.entities.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface ManagerDao extends JpaRepository<Manager,Integer> {
    Optional<Manager> findByUserAccount(UserAccount managerUser);
}
