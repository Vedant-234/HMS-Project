package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionDao extends JpaRepository<Prescription, Integer> {

    // Patient complete prescription history
    List<Prescription> findByPatient_Patientid(int patientid);

    // Prescriptions for one medical record
    List<Prescription> findByPatientMedicalRecord_Recordid(int recordid);

    List<Prescription> findByPatient_PatientidAndDoctor_Doctorid(
            int patientid,
            int doctorid
    );

    List<Prescription> findByDoctor_Doctorid(int doctorId);

}