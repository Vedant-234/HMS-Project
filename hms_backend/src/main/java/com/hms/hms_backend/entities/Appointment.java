package com.hms.hms_backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "appointment",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"doctorid", "scheduled_at"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointmentid")
    private int appointmentId;

    @ManyToOne
    @JoinColumn(name = "patientid", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctorid", nullable = false)
    private Doctor doctor;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AppointmentStatus status;

    @Column(length = 2000)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        status = AppointmentStatus.SCHEDULED;
    }
}