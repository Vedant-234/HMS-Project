package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.InvoiceDao;
import com.hms.hms_backend.daos.PaymentDao;
import com.hms.hms_backend.dtos.request.AddPaymentRequest;
import com.hms.hms_backend.dtos.response.PaymentResponse;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.services.PaymentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentDao paymentDao;
    private final InvoiceDao invoiceDao;

    public PaymentServiceImpl(PaymentDao paymentDao, InvoiceDao invoiceDao) {
        this.paymentDao = paymentDao;
        this.invoiceDao = invoiceDao;
    }

    // ================= MAKE PAYMENT =================
    @Override
    public PaymentResponse makePayment(AddPaymentRequest request) {

        Invoice invoice = invoiceDao.findById(request.getInvoiceid())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // 💰 Total already paid
        double alreadyPaid = paymentDao
                .findByInvoice_Invoiceid(invoice.getInvoiceid())
                .stream()
                .mapToDouble(Payment::getTotalamount)
                .sum();

        double newTotalPaid = alreadyPaid + request.getTotalamount();

        // 🔁 Update invoice status
        if (newTotalPaid == 0) {
            invoice.setPaymentStatus(PaymentStatus.UNPAID);
        } else if (newTotalPaid < invoice.getNettotal()) {
            invoice.setPaymentStatus(PaymentStatus.PARTIAL);
        } else {
            invoice.setPaymentStatus(PaymentStatus.PAID);
        }

        invoiceDao.save(invoice);

        // 💳 Save payment
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setTotalamount(request.getTotalamount());
        payment.setPaymentmethod(request.getPaymentmethod());
        payment.setTransactionref(request.getTransactionref());

        payment = paymentDao.save(payment);

        return mapToResponse(payment, invoice);
    }

    // ================= GET PAYMENTS BY INVOICE ID (ADD TOKEN DOCTOR/MANAGER) =================
    @Override
    public List<PaymentResponse> getPaymentsByInvoice(int invoiceId) {

        return paymentDao.findByInvoice_Invoiceid(invoiceId)
                .stream()
                .map(p -> mapToResponse(p, p.getInvoice()))
                .toList();
    }

    // ================= MAPPER =================
    private PaymentResponse mapToResponse(Payment payment,Invoice invoice) {

        PaymentResponse res = new PaymentResponse();

        res.setPaymentId(payment.getPaymentid());
        res.setInvoiceId(payment.getInvoice().getInvoiceid());
        res.setAmountPaid(payment.getTotalamount());
        res.setPaymentMethod(payment.getPaymentmethod());
        res.setTransactionRef(payment.getTransactionref());
        res.setInvoiceStatus(invoice.getPaymentStatus().name());
        res.setPaymentDate(payment.getPaymentDate());




        return res;
    }
}
