package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doctorid;

    @OneToOne
    @JoinColumn(name = "userid")
    private UserAccount userAccount;

    @ManyToOne
    @JoinColumn(name = "managerid")
    private Manager manager;

    @Column(nullable = false, length = 150)
    private String name;

    private String gender;

    @Column(nullable = false, length = 150)
    private String speciality;

    private String mobile;
    private String image;

    @Enumerated(EnumType.STRING)
    private DoctorStatus status = DoctorStatus.ACTIVE;

    @Column(name = "consultation_duration", nullable = false)
    private int consultationDuration = 30;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}