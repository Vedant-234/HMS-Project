package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "patient",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "userid"),
                @UniqueConstraint(columnNames = "mobile")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int patientid;

    // 🔗 Link to user_account (authentication)
    @OneToOne(optional = false)
    @JoinColumn(name = "userid")
    private UserAccount userAccount;


    @Column(nullable = false, length = 100)
    private String firstname;

    @Column(nullable = false, length = 100)
    private String lastname;

    @Column(length = 20)
    private String gender;

    @Column(name = "dateofbirth")
    private LocalDate dateOfBirth;

    @Column(length = 20, unique = true)
    private String mobile;

    @Column(length = 255)
    private String address;


    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime localDateTime;

    @PrePersist
    protected void onCreate() {
        this.localDateTime = LocalDateTime.now();
    }


}