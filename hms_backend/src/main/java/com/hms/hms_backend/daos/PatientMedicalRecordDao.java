package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.PatientMedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientMedicalRecordDao extends JpaRepository<PatientMedicalRecord,Integer> {
    List<PatientMedicalRecord> findByPatient_Patientid(int patientId);

    List<PatientMedicalRecord> findByDoctor_Doctorid(int doctorId);
}
