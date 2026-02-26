package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.entities.Invoice;
import com.hms.hms_backend.services.InvoicePdfService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;

@Service
public class InvoicePdfServiceImpl implements InvoicePdfService {

    @Override
    public byte[] generateInvoicePdf(Invoice invoice) {

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // ===== TITLE =====
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("HMS Hospital Invoice", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" "));

            // ===== BASIC INFO =====
            document.add(new Paragraph("Invoice ID : " + invoice.getInvoiceid()));
            document.add(new Paragraph("Date : " + invoice.getDate()));
            document.add(new Paragraph("Payment Status : " + invoice.getPaymentStatus()));
            document.add(new Paragraph(" "));

            // ===== PATIENT & DOCTOR =====
            document.add(new Paragraph(
                    "Patient : " +
                            invoice.getPatient().getFirstname() + " " +
                            invoice.getPatient().getLastname()
            ));

            if (invoice.getPrescription() != null) {
                document.add(new Paragraph(
                        "Doctor : " +
                                invoice.getPrescription().getDoctor().getName()
                ));
            }

            document.add(new Paragraph(" "));

            // ===== TABLE =====
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3, 1});

            addHeaderCell(table, "Description");
            addHeaderCell(table, "Amount");

            addRow(table, "Doctor Fees", invoice.getDoctorFees());
            addRow(table, "Medicine Fees", invoice.getMedicineFees());
            addRow(table, "Lab Test Fees", invoice.getLabtestFees());

            addHeaderCell(table, "Subtotal");
            addHeaderCell(table, "₹ " + invoice.getSubtotal());

            addHeaderCell(table, "Net Total");
            addHeaderCell(table, "₹ " + invoice.getNettotal());

            document.add(table);

            document.add(new Paragraph("\nThank you for choosing HMS Hospital"));
            document.add(new Paragraph("This is a system generated invoice"));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Invoice PDF generation failed");
        }

        return out.toByteArray();
    }

    // ===== HELPERS =====
    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text));
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        cell.setPadding(8);
        table.addCell(cell);
    }

    private void addRow(PdfPTable table, String label, double value) {
        table.addCell(label);
        table.addCell("₹ " + value);
    }
}
