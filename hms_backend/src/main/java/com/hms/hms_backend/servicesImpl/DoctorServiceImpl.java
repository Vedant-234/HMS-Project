package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.DoctorDao;
import com.hms.hms_backend.daos.UserAccountDao;
import com.hms.hms_backend.dtos.request.DoctorRequest;
import com.hms.hms_backend.dtos.request.DoctorStatusRequest;
import com.hms.hms_backend.dtos.response.DoctorResponse;
import com.hms.hms_backend.dtos.response.DoctorStatusResponse;
import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.entities.DoctorStatus;
import com.hms.hms_backend.entities.UserAccount;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.DoctorService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorDao doctorDao;
    private final UserAccountDao userAccountDao;
    private final JwtTokenUtil jwtTokenUtil;

    public DoctorServiceImpl(DoctorDao doctorDao,
                             UserAccountDao userAccountDao,
                             JwtTokenUtil jwtTokenUtil) {
        this.doctorDao = doctorDao;
        this.userAccountDao = userAccountDao;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    // ✅ Extract email from Bearer token
    private String getEmailFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized - Token missing");
        }

        String token = authHeader.substring(7);
        return jwtTokenUtil.getEmailFromToken(token);
    }

    @Override
    public DoctorResponse getLoggedInDoctorProfile(HttpServletRequest request) {

        // ✅ 1. Get email from token
        String email = getEmailFromRequest(request);

        // ✅ 2. Get UserAccount
        UserAccount user = userAccountDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ 3. Get Doctor entity
        Doctor doctor = doctorDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        // ✅ 4. Map to DTO
        return new DoctorResponse(
                doctor.getDoctorid(),
                doctor.getName(),
                doctor.getSpeciality(),
                doctor.getMobile(),
                doctor.getConsultationDuration(),
                doctor.getStatus()
        );
    }

    @Override
    public DoctorResponse updateMyProfile(DoctorRequest doctorRequest, HttpServletRequest request) {

        String email = getEmailFromRequest(request);

        UserAccount user = userAccountDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorDao.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        doctor.setName(doctorRequest.getName());
        doctor.setSpeciality(doctorRequest.getSpeciality());
        doctor.setMobile(doctorRequest.getMobile());
        doctor.setConsultationDuration(doctorRequest.getConsultationDuration());

        doctor = doctorDao.save(doctor);

        return mapToResponse(doctor);
    }

    @Override
    public DoctorStatusResponse updateDoctorStatus(int doctorId, DoctorStatusRequest request) {

        Doctor doctor = doctorDao.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setStatus(request.getStatus());
        doctorDao.save(doctor);

        return new DoctorStatusResponse(
                doctor.getDoctorid(),
                doctor.getStatus(),
                "Doctor status updated successfully"
        );
    }

    @Override
    public List<DoctorResponse> getDoctorsBySpeciality(String speciality) {

        List<Doctor> doctors = doctorDao.findBySpecialityAndStatus(
                speciality,
                DoctorStatus.ACTIVE
        );

        return doctors.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponse> getDoctorsByStatus(DoctorStatus status) {

        List<Doctor> doctors = doctorDao.findByStatus(status);

        return doctors.stream()
                .map(d -> new DoctorResponse(
                        d.getDoctorid(),
                        d.getName(),
                        d.getSpeciality(),
                        d.getMobile(),
                        d.getConsultationDuration(),
                        d.getStatus()
                ))
                .collect(Collectors.toList());
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();
        response.setDoctorId(doctor.getDoctorid());
        response.setName(doctor.getName());
        response.setSpeciality(doctor.getSpeciality());
        response.setMobile(doctor.getMobile());
        response.setConsultationDuration(doctor.getConsultationDuration());
        response.setStatus(doctor.getStatus());
        return response;
    }
}