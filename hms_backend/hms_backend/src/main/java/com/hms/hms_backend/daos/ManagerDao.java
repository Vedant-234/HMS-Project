package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Manager;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ManagerDao extends JpaRepository<Manager,Integer> {
}
