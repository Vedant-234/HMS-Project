package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Invoice;
import com.hms.hms_backend.entities.Patient;
import com.hms.hms_backend.entities.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceDao extends JpaRepository<Invoice,Integer> {
    // Patient name se invoice
    @Query("""
    SELECT i
    FROM Invoice i
    JOIN i.patient p
    WHERE LOWER(p.firstname) LIKE LOWER(CONCAT('%', :name, '%'))
       OR LOWER(p.lastname) LIKE LOWER(CONCAT('%', :name, '%'))
""")
    List<Invoice> searchByPatientName(@Param("name") String name);


    // Logged-in patient ke invoices
    List<Invoice> findByPatient_Patientid(int patientid);

    Optional<Invoice> findByPatient_PatientidAndPaymentStatus(
            int patientid,
            PaymentStatus paymentStatus
    );


}
