package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.DoctorDao;
import com.hms.hms_backend.daos.UserAccountDao;
import com.hms.hms_backend.dtos.request.DoctorRequest;
import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.entities.UserAccount;
import com.hms.hms_backend.entities.UserRole;
import com.hms.hms_backend.services.DoctorService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final UserAccountDao userAccountDao;
    private final DoctorDao doctorDao;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImpl(UserAccountDao userAccountDao, DoctorDao doctorDao, PasswordEncoder passwordEncoder) {
        this.userAccountDao = userAccountDao;
        this.doctorDao = doctorDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Doctor createDoctor(DoctorRequest request) {
        // Create user account for doctor
        UserAccount user = new UserAccount();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.DOCTOR);

        userAccountDao.save(user);

        // Create doctor
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpeciality(request.getSpeciality());
        doctor.setMobile(request.getMobile());
        doctor.setUserAccount(user);

        return doctorDao.save(doctor);
    }
}
