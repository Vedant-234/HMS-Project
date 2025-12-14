package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.DoctorRequest;
import com.hms.hms_backend.entities.Doctor;

public interface DoctorService {
    Doctor createDoctor(DoctorRequest request);
}
