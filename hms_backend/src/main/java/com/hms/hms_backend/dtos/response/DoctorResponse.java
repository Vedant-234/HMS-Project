package com.hms.hms_backend.dtos.response;


import com.hms.hms_backend.entities.DoctorStatus;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Data
public class DoctorResponse {

    private int doctorId;
    private String name;
    private String speciality;
    private String mobile;
    private int consultationDuration;
    private DoctorStatus status;


    public DoctorResponse(int doctorId,
                                 String name,
                                 String speciality,
                                 String mobile,
                                 int consultationDuration
                          ) {
        this.doctorId = doctorId;
        this.name = name;
        this.speciality = speciality;
        this.mobile = mobile;
        this.consultationDuration = consultationDuration;
    }
    public DoctorResponse(int doctorId, String name, String speciality, String mobile, int consultationDuration, DoctorStatus status) {
        this.doctorId = doctorId;
        this.name = name;
        this.speciality = speciality;
        this.mobile = mobile;
        this.consultationDuration = consultationDuration;
        this.status = status;
    }
}