package com.hms.hms_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class DoctorProfileResponse {

    private int doctorId;
    private String name;
    private String speciality;
    private String mobile;
    private int consultationDuration;

    public DoctorProfileResponse(int doctorId,
                                 String name,
                                 String speciality,
                                 String mobile,
                                 int consultationDuration) {
        this.doctorId = doctorId;
        this.name = name;
        this.speciality = speciality;
        this.mobile = mobile;
        this.consultationDuration = consultationDuration;
    }

    // getters & setters
}
