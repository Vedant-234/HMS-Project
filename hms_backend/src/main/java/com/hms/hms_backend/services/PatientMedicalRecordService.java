package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.PatientMedicalRecordRequest;
import com.hms.hms_backend.dtos.request.UpdatePatientMedicalRecordRequest;
import com.hms.hms_backend.dtos.response.PatientMedicalRecordResponse;

import java.util.List;

public interface PatientMedicalRecordService {

    void createRecord(PatientMedicalRecordRequest request);

    void updateRecord(int recordId, UpdatePatientMedicalRecordRequest request);

    List<PatientMedicalRecordResponse> getRecordsForLoggedInDoctor();

    List<PatientMedicalRecordResponse> getRecordsForLoggedInPatient();

    List<PatientMedicalRecordResponse> getRecordsByDoctor(int doctorId);

    List<PatientMedicalRecordResponse> getAllRecordsForManager();
}