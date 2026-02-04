package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "medicine_stock_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineStockHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int medicineId;

    private String medicineName;

    private int changeQty;   // +10 or -5

    private int finalStock;  // stock after change

    private String reason;   // ADDED / DISPENSED / UPDATED / DELETED / EXPIRED

    @Column(name="created_at")
    private LocalDate createdAt;
}
