package com.hms.hms_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoice_line_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lineitemid;

    @ManyToOne
    @JoinColumn(name = "invoiceid")
    private Invoice invoice;


    private String itemtype;   // DOCTOR / MEDICINE / LAB
    private Integer itemrefid;

    private String description;
    private double unitprice;
    private int quantity;
    private double linetotal;
}
