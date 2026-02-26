package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentDao extends JpaRepository<Payment, Integer> {

    // Search payment by invoice id
    List<Payment> findByInvoice_Invoiceid(int invoiceId);

}
