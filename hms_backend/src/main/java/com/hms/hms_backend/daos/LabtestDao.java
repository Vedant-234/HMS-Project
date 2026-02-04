package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Labtest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LabtestDao extends JpaRepository<Labtest,Integer> {
    List<Labtest> findByTestNameContainingIgnoreCase(String testName);
}
