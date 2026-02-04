package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "visit")
@Data
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int visitid;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patientid")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctorid")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "visit_date", nullable = false)
    private LocalDateTime visitDate;

    @Column(name = "visit_type")
    private String visitType;

    @Column(name = "reason", length = 1000)
    private String reason;

    @Enumerated(EnumType.STRING)
    private VisitStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}