package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.DoctorRequest;
import com.hms.hms_backend.dtos.request.DoctorStatusRequest;
import com.hms.hms_backend.dtos.response.DoctorResponse;
import com.hms.hms_backend.dtos.response.DoctorStatusResponse;
import com.hms.hms_backend.entities.DoctorStatus;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface DoctorService {

    DoctorResponse getLoggedInDoctorProfile(HttpServletRequest request);

    DoctorResponse updateMyProfile(DoctorRequest doctorRequest, HttpServletRequest request);

    DoctorStatusResponse updateDoctorStatus(int doctorId, DoctorStatusRequest request);

    List<DoctorResponse> getDoctorsBySpeciality(String speciality);

    List<DoctorResponse> getDoctorsByStatus(DoctorStatus status);
}