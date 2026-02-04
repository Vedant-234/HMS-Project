package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(
        name="user_account",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;
    @Column(nullable = false, length = 100, unique = true)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;
    @Column(length = 150, unique = true, nullable = false)
    private String email;
    @Column(name = "created_at")
    private LocalDateTime localDateTime;
    @Column(name = "updated_at")
    private LocalDateTime localDateTimes;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.localDateTime = now;
        this.localDateTimes = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.localDateTimes = LocalDateTime.now();
    }
}