package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.PrescriptionLineItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionLineItemDao
        extends JpaRepository<PrescriptionLineItem, Integer> {

    List<PrescriptionLineItem> findByPrescription_Prescriptionid(int prescriptionid);

}
