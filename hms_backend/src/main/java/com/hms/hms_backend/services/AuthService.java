package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.*;
import com.hms.hms_backend.dtos.response.AuthResponse;
import com.hms.hms_backend.dtos.response.GetPatientProfileResponse;
import com.hms.hms_backend.dtos.response.MedicineStockResponse;
import com.hms.hms_backend.entities.Doctor;
import com.hms.hms_backend.entities.MedicineRecord;
import com.hms.hms_backend.entities.MedicineStockHistory;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse registerPatient(RegisterPatientRequest request);

    AuthResponse registerDoctor(RegisterDoctorRequest request, HttpServletRequest httpRequest);


    //This function is common for all (Manager,Doctor and Patient) When they are change the Password
    void changePassword(ChangePasswordRequest request);

    //Adding the medicine
    void addMedicine(AddMedicineRequest request);

    //get the medicine with stock, knowing how much medicine I have in my stock
    List<MedicineStockResponse> getAllMedicines();

    //when medicine will reduce
    void reduceMedicineStock(int medicineId, int usedQty);

    //Search medicine by name
    List<MedicineStockResponse> searchMedicineByName(String name);

    //Search medicine by id
    MedicineStockResponse searchMedicineStockById(int medicineId);

    //delete the medicine by id
    void deleteMedicineById(int medicineId);

    //update the medicine of every column
    void updateMedicine(int medicineId, UpdateMedicineRequest request);

    //View History by medicine
    List<MedicineStockHistory> getMedicineHistory(int medicineId);

    //View All History At a time
    List<MedicineStockHistory> getAllMedicineHistory();




}