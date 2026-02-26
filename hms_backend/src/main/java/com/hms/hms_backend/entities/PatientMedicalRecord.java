package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient_medical_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientMedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recordid;

    @ManyToOne
    @JoinColumn(name = "patientid",nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctorid", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "testid")
    private Labtest labtest; // optional

    @Column(length = 2000)
    private String diagnosis;

    @Column(name = "treatment_plan", length = 2000)
    private String treatmentPlan;

    @Column(name = "currentVisit", updatable = false)
    private LocalDateTime currentVisit;

    @Column(name = "lastVisit")
    private LocalDateTime lastVisit;

    @PrePersist
    public void onCreate() {
        this.currentVisit = LocalDateTime.now();
        this.lastVisit = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.lastVisit = LocalDateTime.now();
    }
}
