package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int prescriptionid;

    //  Patient Medical Record
    @ManyToOne
    @JoinColumn(name = "recordid",nullable = false)
    private PatientMedicalRecord patientMedicalRecord;

    //  Patient
    @ManyToOne
    @JoinColumn(name = "patientid",nullable = false)
    private Patient patient;

    //  Doctor
    @ManyToOne
    @JoinColumn(name = "doctorid",nullable = false)
    private Doctor doctor;

    @Column(name = "date_issued",updatable = false)
    private LocalDateTime dateIssued;

    @Column(name = "medicine_fees")
    private double medicineFees;

    // REQUIRED GETTER
    public double getMedicineFees() {
        return medicineFees;
    }

    public void setMedicineFees(double medicineFees) {
        this.medicineFees = medicineFees;
    }

    @Column(length = 2000)
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.dateIssued = now;
    }
}
