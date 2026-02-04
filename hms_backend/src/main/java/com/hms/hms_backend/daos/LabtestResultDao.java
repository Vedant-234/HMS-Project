package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.LabtestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabtestResultDao extends JpaRepository<LabtestResult, Integer> {

    List<LabtestResult> findByPatientMedicalRecord_Patient_Patientid(int patientId);

    List<LabtestResult> findByLabtest_Testid(int testid);

    List<LabtestResult> findAll();
}