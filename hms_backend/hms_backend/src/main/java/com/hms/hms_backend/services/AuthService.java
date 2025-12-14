package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.LoginRequest;
import com.hms.hms_backend.dtos.request.RegisterPatientRequest;
import com.hms.hms_backend.dtos.response.AuthResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse registerPatient(RegisterPatientRequest request);
}