package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.*;
import com.hms.hms_backend.dtos.response.MedicineStockResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import com.hms.hms_backend.dtos.request.*;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.dtos.response.GetPatientProfileResponse;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.security.JwtTokenUtil;
import com.hms.hms_backend.services.AuthService;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    //DAO'S
    private final UserAccountDao userAccountDao;
    private final PatientDao patientDao;
    private final DoctorDao doctorDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtUtil;
    private final ManagerDao managerDao;
    private final MedicineStockHistoryDao medicineStockHistoryDao;


    //DAO'S CONSTRUCTOR

    public AuthServiceImpl(UserAccountDao userAccountDao,
                           PatientDao patientDao, DoctorDao doctorDao,
                           PasswordEncoder passwordEncoder,
                           JwtTokenUtil jwtUtil, ManagerDao managerDao, MedicineStockHistoryDao medicineStockHistoryDao, MedicineRecordDao medicineRecordDao) {

        this.userAccountDao = userAccountDao;
        this.patientDao = patientDao;
        this.doctorDao = doctorDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.managerDao = managerDao;
        this.medicineStockHistoryDao = medicineStockHistoryDao;
        this.medicineRecordDao = medicineRecordDao;
    }

    //METHOD'S

    // LOGIN (ALL ROLES)
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

    //  REGISTER PATIENT
    @Override
    public AuthResponse registerPatient(RegisterPatientRequest request) {

        UserAccount user = new UserAccount();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.PATIENT);
        user = userAccountDao.save(user);

        //Create Patient Profile
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

    //REGISTER DOCTOR

    @Override
    public AuthResponse registerDoctor(RegisterDoctorRequest request, HttpServletRequest httpRequest) {
//        Manager manager = managerDao.findById(managerId)
//                .orElseThrow(() -> new RuntimeException("Manager not found"));

        // Extract token from header
        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized access");
        }

        String token = authHeader.substring(7);

        //  Get logged-in manager email from token
        String managerEmail = jwtUtil.getEmailFromToken(token);

        if (managerEmail == null) {
            throw new RuntimeException("Unauthorized access");
        }

        // Fetch manager user account
        UserAccount managerUser = userAccountDao.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("Manager account not found"));

        //  Fetch manager profile
        Manager manager = managerDao.findByUserAccount(managerUser)
                .orElseThrow(() -> new RuntimeException("Manager profile not found"));
        //Create Doctor Login Account
        UserAccount user = new UserAccount();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.DOCTOR);

        userAccountDao.save(user);

        //Create Doctor Profile
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setDoctorConsultationFee(request.getDoctorConsultationFee());
        doctor.setSpeciality(request.getSpeciality());
        doctor.setGender(request.getGender());
        doctor.setMobile(request.getMobile());
        doctor.setConsultationDuration(request.getConsultationDuration());
        doctor.setUserAccount(user);
        doctor.setManager(manager);
        doctorDao.save(doctor);

        //String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getRole().name());
    }



    //It's a Change Password Implementation

    @Override
    public void changePassword(ChangePasswordRequest request) {

        //Find out user by the help of Email(Manager/Doctor/Patient)
        UserAccount user = userAccountDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

//        // There is known the old password,it will be entered
//        if (!passwordEncoder.matches(
//                request.getOldPassword(),
//                user.getPasswordHash())) {
//            throw new RuntimeException("Old password is incorrect");
//        }

        //generate New password
        String hashedPassword = passwordEncoder.encode(request.getNewPassword());

        // There to setting the new password and Update the DB
        user.setPasswordHash(hashedPassword);

//        user.setPasswordHash(
//                passwordEncoder.encode(request.getNewPassword()));

        //Here is New Password Save
        userAccountDao.save(user);
    }

    private final MedicineRecordDao medicineRecordDao;


    //Add medicine Logic

    @Override
    public void addMedicine(AddMedicineRequest request) {
        // 🔐 Get logged-in manager from JWT SecurityContext
        UserAccount loggedInUser = (UserAccount)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        Manager manager = managerDao.findByUserAccount(loggedInUser)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Medicine name is required");
        }

        if (request.getQuantity() < 0) {
            throw new RuntimeException("Quantity cannot be negative");
        }

        if (request.getPrice() < 0) {
            throw new RuntimeException("Price cannot be negative");
        }

        if (request.getImage() == null || request.getImage().isEmpty()) {
            throw new RuntimeException("Medicine image is required");
        }

        MultipartFile image = request.getImage(); //getting image file
        String originalFileName = request.getImage().getOriginalFilename(); //getting image name
        String fileName = System.currentTimeMillis() + "_" + originalFileName; //server give always unique name

        try {
            String uploadDir = "D:/Secret Project/hms_backend/hms_backend/src/main/java/com/hms/hms_backend/asset/medicine-images";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File destination = new File(uploadDir + "/" + fileName);
            request.getImage().transferTo(destination);

            MedicineRecord medicine = new MedicineRecord();
            medicine.setName(request.getName());
            medicine.setType(request.getType());
            medicine.setImage(fileName);
            medicine.setQuantity(request.getQuantity());
            medicine.setPrice(request.getPrice());
            medicine.setExpiryDate(request.getExpiryDate());
            medicine.setManager(manager);
            //HISTORY MEIN ADD HONGA
            saveStockHistory(medicine, medicine.getQuantity(), "ADDED");
            medicineRecordDao.save(medicine);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image");
        }
    }

    //making implementation for knowing how much medicine I have in my stock
    @Override
    public List<MedicineStockResponse> getAllMedicines() {
        return medicineRecordDao.findAll() .stream()
                .map(medicine -> {
                    MedicineStockResponse dto = new MedicineStockResponse();
                    dto.setMedicineid(medicine.getMedicineid());
                    dto.setName(medicine.getName());
                    dto.setType(medicine.getType());
                    dto.setQuantity(medicine.getQuantity());
                    dto.setImage(medicine.getImage());
                    dto.setPrice(medicine.getPrice());
                    dto.setExpiryDate(medicine.getExpiryDate());
                    dto.setQuantity(medicine.getQuantity());
                    return dto;
                })
                .toList();
    }

    //making implementation when medicine will reduce
    @Override
    public void reduceMedicineStock(int medicineId, int usedQty) {

        MedicineRecord medicine = medicineRecordDao.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (medicine.getQuantity() < usedQty) {
            throw new RuntimeException("Not medicine available in stock");
        }
        // when stock is reduce that time this code will be the work
        medicine.setQuantity(medicine.getQuantity() - usedQty);
        medicineRecordDao.save(medicine);

        //HISTORY LOG
        saveStockHistory(medicine,-usedQty,"DISPENSED");
    }

    @Override
    public List<MedicineStockResponse> searchMedicineByName(String name) {

        return medicineRecordDao.findByNameContainingIgnoreCase(name)
                .stream()
                .map(medicine -> {
                    MedicineStockResponse dto = new MedicineStockResponse();
                    dto.setMedicineid(medicine.getMedicineid());
                    dto.setName(medicine.getName());
                    dto.setQuantity(medicine.getQuantity());
                    dto.setType(medicine.getType());
                    dto.setPrice(medicine.getPrice());
                    dto.setImage(medicine.getImage());
                    dto.setExpiryDate(medicine.getExpiryDate());
                    return dto;
                })
                .toList();
    }

    //search medicine by id implementation
    @Override
    public MedicineStockResponse searchMedicineStockById(int medicineId) {

        MedicineRecord medicine = medicineRecordDao.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        MedicineStockResponse dto = new MedicineStockResponse();
        dto.setMedicineid(medicine.getMedicineid());
        dto.setName(medicine.getName());
        dto.setQuantity(medicine.getQuantity());
        dto.setType(medicine.getType());
        dto.setPrice(medicine.getPrice());
        dto.setImage(medicine.getImage());
        dto.setExpiryDate(medicine.getExpiryDate());
        return dto;
    }

    @Override
    public void deleteMedicineById(int medicineId) {

        MedicineRecord medicine = medicineRecordDao.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        // history BEFORE delete
        saveStockHistory(medicine, 0, "DELETED");

        medicineRecordDao.delete(medicine);
    }

    @Override
    public void updateMedicine(int medicineId, UpdateMedicineRequest request) {

        MedicineRecord medicine = medicineRecordDao.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        // Update only if value provided
        if (request.getName() != null) {
            medicine.setName(request.getName());
        }

        if (request.getType() != null) {
            medicine.setType(request.getType());
        }

        if (request.getImage() != null) {
            medicine.setImage(request.getImage());
        }

        if (request.getQuantity() != null) {
            if (request.getQuantity() < 0) {
                throw new RuntimeException("Quantity cannot be negative");
            }
            medicine.setQuantity(request.getQuantity());
        }

        if (request.getPrice() != null) {
            if (request.getPrice() < 0) {
                throw new RuntimeException("Price cannot be negative");
            }
            medicine.setPrice(request.getPrice());
        }

        //EXPIRY RULE: once set — cannot change
        if (request.getExpiryDate() != null) {

            if (medicine.getExpiryDate() != null) {
                throw new RuntimeException("Expiry date cannot be changed once set");
            }

            // only allowed if expiryDate is not set earlier

            medicine.setExpiryDate(request.getExpiryDate());
        }

        if (request.getQuantity() != null) {

            int diff = request.getQuantity() - medicine.getQuantity();
            medicine.setQuantity(request.getQuantity());
            medicineRecordDao.save(medicine);

            if (diff != 0) {
                saveStockHistory(medicine, diff, "ADDED");
            }
        }

        medicineRecordDao.save(medicine);

    }
    public void expireMedicine(int medicineId) {

        MedicineRecord medicine = medicineRecordDao.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        // history
        saveStockHistory(medicine, 0, "EXPIRED");

        medicine.setQuantity(0);
        medicineRecordDao.save(medicine);
    }

    @Override
    public List<MedicineStockHistory> getMedicineHistory(int medicineId) {
        return medicineStockHistoryDao
                .findByMedicineIdOrderByCreatedAtDesc(medicineId);
    }

    //whenever medicine stock will change, save the all changes record into medicine history database
    private void saveStockHistory(
            MedicineRecord medicine,
            int changeQty,
            String reason
    ) {
        MedicineStockHistory history = new MedicineStockHistory();

        history.setMedicineId(medicine.getMedicineid());
        history.setMedicineName(medicine.getName());
        history.setChangeQty(changeQty);
        history.setFinalStock(medicine.getQuantity());
        history.setReason(reason);
        history.setCreatedAt(LocalDate.now());

        medicineStockHistoryDao.save(history);
    }

    // get the all medicine stock of history that's implementation
    @Override
    public List<MedicineStockHistory> getAllMedicineHistory() {

        return medicineStockHistoryDao.findAll();
    }

}