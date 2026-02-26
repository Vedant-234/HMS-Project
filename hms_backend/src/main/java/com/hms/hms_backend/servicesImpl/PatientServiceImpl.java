package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.PatientDao;
import com.hms.hms_backend.daos.UserAccountDao;
import com.hms.hms_backend.dtos.request.UpdatePatientProfileRequest;
import com.hms.hms_backend.dtos.response.GetPatientProfileResponse;
import com.hms.hms_backend.entities.Patient;
import com.hms.hms_backend.entities.UserAccount;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientDao patientDao;
    private final UserAccountDao userAccountDao;
    private final JwtTokenUtil jwtTokenUtil;

    public PatientServiceImpl(PatientDao patientDao,
                              UserAccountDao userAccountDao,
                              JwtTokenUtil jwtTokenUtil) {
        this.patientDao = patientDao;
        this.userAccountDao = userAccountDao;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    // ✅ Extract Email from Request Token
    private String getEmailFromRequest(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header missing or invalid");
        }

        String token = authHeader.substring(7);

        return jwtTokenUtil.getEmailFromToken(token);
    }

    // ✅ GET LOGGED-IN PATIENT PROFILE
    @Override
    public GetPatientProfileResponse getLoggedInPatientProfile(HttpServletRequest request) {

        // ✅ 1) Extract email from JWT
        String email = getEmailFromRequest(request);

        // ✅ 2) Find UserAccount
        UserAccount user = userAccountDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ 3) Find Patient profile
        Patient patient = patientDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        // ✅ 4) Return Response DTO
        return mapToResponse(patient);
    }

    // ✅ UPDATE LOGGED-IN PATIENT PROFILE
    @Override
    public GetPatientProfileResponse updateMyProfile(UpdatePatientProfileRequest request,
                                                     HttpServletRequest httpRequest) {

        // ✅ 1) Extract email from JWT
        String email = getEmailFromRequest(httpRequest);

        // ✅ 2) Find UserAccount
        UserAccount user = userAccountDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ 3) Find Patient profile
        Patient patient = patientDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        // ✅ 4) Update fields
        if (request.getFirstname() != null) patient.setFirstname(request.getFirstname());
        if (request.getLastname() != null) patient.setLastname(request.getLastname());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getMobile() != null) patient.setMobile(request.getMobile());
        if (request.getAddress() != null) patient.setAddress(request.getAddress());

        patient = patientDao.save(patient);

        return mapToResponse(patient);
    }

    // ✅ Mapper Entity → Response DTO
    private GetPatientProfileResponse mapToResponse(Patient patient) {

        GetPatientProfileResponse response = new GetPatientProfileResponse();
        response.setPatientid(patient.getPatientid());
        response.setFirstname(patient.getFirstname());
        response.setLastname(patient.getLastname());
        response.setGender(patient.getGender());
        response.setDateOfBirth(patient.getDateOfBirth());
        response.setMobile(patient.getMobile());
        response.setAddress(patient.getAddress());
        response.setEmail(patient.getUserAccount().getEmail());

        return response;
    }
}