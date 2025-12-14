package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(
        name = "labtest"
)
public class Labtest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int testid;
    @Column(name = "testname", nullable = false)
    private String testName;
    private String description;
    private String image;
    private int managerid;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;
    @Column(name = "lab_test_fees", nullable = false)
    private double labTestFees;
}