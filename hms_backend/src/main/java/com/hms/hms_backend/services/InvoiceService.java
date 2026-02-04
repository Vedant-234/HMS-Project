package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.response.InvoiceResponse;
import com.hms.hms_backend.entities.LabtestResult;
import com.hms.hms_backend.entities.Prescription;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface InvoiceService {
    //  Patient → apna bill
    List<InvoiceResponse> getMyInvoices(HttpServletRequest request);

    // ️ Doctor → patient name se search
    List<InvoiceResponse> searchInvoicesByPatientName(String name);

    // Manager → sab invoices
    List<InvoiceResponse> getAllInvoices();

    void generateInvoiceFromPrescription(Prescription prescription);

    void generateInvoiceFromLabtest(LabtestResult labtestResult);
}
