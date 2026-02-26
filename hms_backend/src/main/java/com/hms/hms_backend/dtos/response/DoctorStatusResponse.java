package com.hms.hms_backend.dtos.response;



import com.hms.hms_backend.entities.DoctorStatus;
import lombok.Data;

@Data
public class DoctorStatusResponse {

    private int doctorId;
    private DoctorStatus status;
    private String message;

    public DoctorStatusResponse(int doctorid, DoctorStatus status, String message) {
        this.doctorId=doctorid;
        this.status=status;
        this.message=message;
    }
}