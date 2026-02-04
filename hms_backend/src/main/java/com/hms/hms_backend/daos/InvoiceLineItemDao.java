package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.Invoice;
import com.hms.hms_backend.entities.InvoiceLineItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceLineItemDao extends JpaRepository<InvoiceLineItem, Integer> {
    List<InvoiceLineItem> findByInvoice(Invoice invoice);
}
