package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "labtest_result")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabtestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer labid;

    // FK → labtest(testid)
    @ManyToOne(optional = false)
    @JoinColumn(name = "testid", nullable = false)
    private Labtest labtest;

    // FK → patient_medical_record(recordid)
    @ManyToOne
    @JoinColumn(name = "recordid")
    private PatientMedicalRecord patientMedicalRecord;

    @Column(name = "result_date", nullable = false)
    private LocalDate resultDate;

    @Column(columnDefinition = "TEXT")
    private String findings;

    @Column(name = "lab_test_fees", nullable = false)
    private Double labTestFees;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDate.now();
    }
}