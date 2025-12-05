package com.hms.hms_backend.entities;

import jakarta.annotation.Nullable;
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
        name = "manager",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "name"),
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "mobile"),

        }
)
public class Manager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int managerid;
    @OneToOne
    @JoinColumn(name = "userid",nullable = false,unique = true)
    private UserAccount userAccount;
    @Column(nullable = false,length = 100,unique = true)
    private String name;
    @Column(length = 150,unique = true)
    private String email;
    @Column(length = 10,unique = true)
    private String mobile;
    @Column(name = "created_at",updatable = false)
    private LocalDateTime createdAt;




}
