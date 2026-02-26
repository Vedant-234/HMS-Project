package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "manager")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Manager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int managerid;

    @OneToOne
    @JoinColumn(name = "userid")
    private UserAccount userAccount;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 20)
    private String mobile;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime localDateTime;

    @PrePersist
    protected void onCreate()
    {
        this.localDateTime = LocalDateTime.now();
    }
}