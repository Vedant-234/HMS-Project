package com.hms.hms_backend.controllers;

import com.hms.hms_backend.dtos.request.AddPaymentRequest;
import com.hms.hms_backend.services.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 💳 MAKE PAYMENT AND ADD PATIENT TOKEN
    @PostMapping
    public ResponseEntity<?> pay(@RequestBody AddPaymentRequest request) {
        return ResponseEntity.ok(paymentService.makePayment(request));
    }

    // 📄 VIEW PAYMENTS OF INVOICE AND ADD MANAGER/DOCTOR/PATIENT TOKENT
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<?> getByInvoice(@PathVariable int invoiceId) {
        return ResponseEntity.ok(
                paymentService.getPaymentsByInvoice(invoiceId)
        );
    }

}
