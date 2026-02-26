package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentid;

    @ManyToOne
    @JoinColumn(name = "invoiceid", nullable = false)
    private Invoice invoice;

    @Column(nullable = false)
    private double totalamount;

    private String paymentmethod;   // UPI / CARD / CASH

    private String transactionref;  // UPI ref / card ref

    @Column(name = "paymentdate", updatable = false)
    private LocalDateTime paymentDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.paymentDate = LocalDateTime.now();
        this.createdAt=createdAt.now();
    }
}
