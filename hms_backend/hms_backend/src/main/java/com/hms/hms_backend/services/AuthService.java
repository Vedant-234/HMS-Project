package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.RegisterDoctorRequest;
import com.hms.hms_backend.dtos.request.LoginRequest;
import com.hms.hms_backend.dtos.request.RegisterPatientRequest;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.entities.Doctor;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse registerPatient(RegisterPatientRequest request);

    AuthResponse registerDoctor(RegisterDoctorRequest request, int managerId);

}