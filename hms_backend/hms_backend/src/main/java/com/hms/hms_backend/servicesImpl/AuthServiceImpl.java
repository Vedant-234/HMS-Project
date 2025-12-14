package com.hms.hms_backend.servicesImpl;


import com.hms.hms_backend.dtos.request.LoginRequest;
import com.hms.hms_backend.dtos.request.RegisterPatientRequest;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.entities.Patient;
import com.hms.hms_backend.entities.UserAccount;
import com.hms.hms_backend.entities.UserRole;
import com.hms.hms_backend.daos.PatientDao;
import com.hms.hms_backend.daos.UserAccountDao;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserAccountDao userAccountDao;
    private final PatientDao patientDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtUtil;

    public AuthServiceImpl(UserAccountDao userAccountDao,
                           PatientDao patientDao,
                           PasswordEncoder passwordEncoder,
                           JwtTokenUtil jwtUtil) {
        this.userAccountDao = userAccountDao;
        this.patientDao = patientDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

    // 🧑‍⚕️ REGISTER (ONLY PATIENT)
    @Override
    public AuthResponse registerPatient(RegisterPatientRequest request) {

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

        patientDao.save(patient);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getRole().name());
    }
}