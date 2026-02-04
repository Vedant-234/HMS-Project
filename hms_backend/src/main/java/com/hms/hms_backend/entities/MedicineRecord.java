package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(
        name = "medicine_record",
        uniqueConstraints = @UniqueConstraint(columnNames = "name")
)
public class MedicineRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int medicineid;
    @Column(nullable = false, length = 100, unique = true)
    private String name;
    @Column(nullable = false, length = 100)
    private String type;
    private String image;
    private int quantity;
    @ManyToOne
    @JoinColumn(name = "managerid")
    private Manager manager;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    private double price;
    @Column(name = "created_at")
    private LocalDateTime localDateTime;
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.localDateTime = now;
        this.modifiedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.modifiedAt = LocalDateTime.now();
    }


}