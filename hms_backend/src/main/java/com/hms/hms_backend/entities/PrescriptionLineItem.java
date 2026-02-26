package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_line_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 🔗 Prescription Header
    @ManyToOne
    @JoinColumn(name = "prescriptionid", nullable = false)
    private Prescription prescription;

    // 🔗 Medicine Master
    @ManyToOne
    @JoinColumn(name = "medicineid", nullable = false)
    private MedicineRecord medicine;

    @Column(nullable = false, length = 200)
    private String dosage;          // e.g. "1-0-1 after food"

    @Column(length = 100)
    private String duration;        // e.g. "5 days"

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private double unitPrice;

    @Column(name = "line_total", nullable = false)
    private double lineTotal;
}
