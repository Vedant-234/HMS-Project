package com.hms.hms_backend.services;

import com.hms.hms_backend.entities.Invoice;

public interface InvoicePdfService {
    byte[] generateInvoicePdf(Invoice invoice);
}
