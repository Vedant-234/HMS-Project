package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.MedicineRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRecordDao extends JpaRepository<MedicineRecord,Integer> {
    List<MedicineRecord> findByNameContainingIgnoreCase(String name);
}
