package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.MedicineStockHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineStockHistoryDao extends JpaRepository<MedicineStockHistory,Integer> {
    List<MedicineStockHistory> findByMedicineIdOrderByCreatedAtDesc(int medicineId);


}
