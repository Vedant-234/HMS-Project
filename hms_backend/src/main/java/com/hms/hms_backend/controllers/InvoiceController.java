package com.hms.hms_backend.controllers;

import com.hms.hms_backend.daos.InvoiceDao;
import com.hms.hms_backend.dtos.response.InvoiceResponse;
import com.hms.hms_backend.entities.Invoice;
import com.hms.hms_backend.services.InvoicePdfService;
import com.hms.hms_backend.services.InvoiceService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoice")
@CrossOrigin
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoicePdfService invoicePdfService;
    private final InvoiceDao invoiceDao;

    public InvoiceController(InvoiceService invoiceService, InvoicePdfService invoicePdfService, InvoiceDao invoiceDao) {
        this.invoiceService = invoiceService;
        this.invoicePdfService = invoicePdfService;
        this.invoiceDao = invoiceDao;
    }

    // 🧑 PATIENT → My invoices Add Patient Token

    @GetMapping("/patient")
    public ResponseEntity<?> getMyInvoices(
            HttpServletRequest request) {

        return ResponseEntity.ok(
                invoiceService.getMyInvoices(request)
        );
    }


//    @GetMapping("/patient")
//    public ResponseEntity<?> myInvoices(HttpServletRequest request) {
//        return ResponseEntity.ok(invoiceService.getMyInvoices(request));
//    }

    // 👨‍⚕️ DOCTOR → search by patient name Add Doctor Token
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String patientName) {
        return ResponseEntity.ok(
                invoiceService.searchInvoicesByPatientName(patientName));
    }

    // 👔 MANAGER → all invoice Add Manager Token

    @GetMapping
    public ResponseEntity<?> getAllInvoices() {

        return ResponseEntity.ok(
                invoiceService.getAllInvoices()
        );
    }


    // DOWNLOAD INVOICE PDF ADD PATIENT TOKEN
    @GetMapping("/{invoiceId}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(
            @PathVariable int invoiceId) {

        Invoice invoice = invoiceDao.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        byte[] pdf = invoicePdfService.generateInvoicePdf(invoice);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + invoiceId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF).body(pdf);

    }
}
