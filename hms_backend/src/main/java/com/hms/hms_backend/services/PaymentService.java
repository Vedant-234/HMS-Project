package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.AddPaymentRequest;
import com.hms.hms_backend.dtos.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse makePayment(AddPaymentRequest request);

    List<PaymentResponse> getPaymentsByInvoice(int invoiceId);

}
