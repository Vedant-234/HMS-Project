package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.dtos.response.PrescriptionResponse;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.Document;
import java.io.ByteArrayOutputStream;

@Service
public class PrescriptionPdfServiceImpl {

    public byte[] generatePdf(PrescriptionResponse prescription) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("HOSPITAL PRESCRIPTION")
                .setBold().setFontSize(18));

        document.add(new Paragraph("Doctor: " + prescription.getDoctorName()));
        document.add(new Paragraph("Notes: " + prescription.getNotes()));
        document.add(new Paragraph(" "));

        Table table = new Table(6);
        table.addHeaderCell("Medicine");
        table.addHeaderCell("Dosage");
        table.addHeaderCell("Duration");
        table.addHeaderCell("Qty");
        table.addHeaderCell("Unit Price");
        table.addHeaderCell("Total");

        prescription.getMedicines().forEach(m -> {
            table.addCell(m.getMedicineName());
            table.addCell(m.getDosage());
            table.addCell(m.getDuration());
            table.addCell(String.valueOf(m.getQuantity()));
            table.addCell(String.valueOf(m.getUnitPrice()));
            table.addCell(String.valueOf(m.getLineTotal()));
        });

        document.add(table);
        document.add(new Paragraph(
                "Total Fees: " + prescription.getTotalMedicineFees()).setBold());

        document.close();
        return out.toByteArray();
    }
}
