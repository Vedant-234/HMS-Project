package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.DoctorDao;
import com.hms.hms_backend.daos.ManagerDao;
import com.hms.hms_backend.daos.PatientDao;
import com.hms.hms_backend.daos.UserAccountDao;
import com.hms.hms_backend.dtos.request.RegisterDoctorRequest;
import com.hms.hms_backend.dtos.request.LoginRequest;
import com.hms.hms_backend.dtos.request.RegisterPatientRequest;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.AuthService;

import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserAccountDao userAccountDao;
    private final PatientDao patientDao;
    private final DoctorDao doctorDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtUtil;
    private final ManagerDao managerDao;

    public AuthServiceImpl(UserAccountDao userAccountDao,
                           PatientDao patientDao, DoctorDao doctorDao,
                           PasswordEncoder passwordEncoder,
                           JwtTokenUtil jwtUtil, ManagerDao managerDao) {

        this.userAccountDao = userAccountDao;
        this.patientDao = patientDao;
        this.doctorDao = doctorDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.managerDao = managerDao;
    }

    // 🔐 LOGIN (ALL ROLES)
    @Override
    public AuthResponse login(LoginRequest request) {

        UserAccount user = userAccountDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name());
    }

    // 🧑‍⚕️ REGISTER PATIENT
    @Override
    public AuthResponse registerPatient(RegisterPatientRequest request) {
        Manager manager = managerDao.findById(9)
                .orElseThrow(() -> new RuntimeException("Default manager not found"));

        UserAccount user = new UserAccount();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.PATIENT);
        user = userAccountDao.save(user);

        Patient patient = new Patient();
        patient.setUserAccount(user);
        patient.setFirstname(request.getFirstname());
        patient.setLastname(request.getLastname());
        patient.setGender(request.getGender());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setMobile(request.getMobile());
        patient.setAddress(request.getAddress());
        patient.setManager(manager);

        patientDao.save(patient);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name());
    }

    @Override
    public AuthResponse registerDoctor(RegisterDoctorRequest request, int managerId) {
        Manager manager = managerDao.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        UserAccount user = new UserAccount();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.DOCTOR);

        userAccountDao.save(user);

        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpeciality(request.getSpeciality());
        doctor.setMobile(request.getMobile());
        doctor.setConsultationDuration(request.getConsultationDuration());
        doctor.setUserAccount(user);
        doctor.setManager(manager);
        doctorDao.save(doctor);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getRole().name());
    }

}
