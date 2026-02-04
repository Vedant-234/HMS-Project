package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int invoiceid;

    // ================= PATIENT =================
    @ManyToOne
    @JoinColumn(name = "patientid", nullable = false)
    private Patient patient;

    // ================= PRESCRIPTION =================
    @ManyToOne
    @JoinColumn(name = "prescriptionid")
    private Prescription prescription;

    // ================= LAB TEST RESULT =================
    @ManyToOne
    @JoinColumn(name = "labid")
    private LabtestResult labtestResult;



    // ================= FEES =================
    private double doctorFees;
    private double medicineFees;
    private double labtestFees;
    private double subtotal;
    private double gstamount;
    private double nettotal;

    // ================= STATUS =================

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status",nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    @Column(name = "created_at",updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "date")
    private LocalDateTime date;

    @PrePersist
    protected void onCreate() {
        this.date = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }
}
