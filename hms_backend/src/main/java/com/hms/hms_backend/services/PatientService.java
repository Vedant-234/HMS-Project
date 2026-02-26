package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.UpdatePatientProfileRequest;
import com.hms.hms_backend.dtos.response.GetPatientProfileResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PatientService {

    GetPatientProfileResponse getLoggedInPatientProfile(HttpServletRequest request);

    GetPatientProfileResponse updateMyProfile(UpdatePatientProfileRequest request,
                                              HttpServletRequest httpRequest);
}