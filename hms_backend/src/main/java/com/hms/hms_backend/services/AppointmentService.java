package com.hms.hms_backend.services;

import com.hms.hms_backend.dtos.request.AssignDoctorRequest;
import com.hms.hms_backend.dtos.request.BookAppointmentRequest;
import com.hms.hms_backend.dtos.response.*;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {

    AppointmentStatusResponse bookAppointment(BookAppointmentRequest request);

    List<AppointmentViewResponse> getMyAppointments();

    AppointmentStatusResponse cancelAppointment(int appointmentId);

    AppointmentStatusResponse completeAppointment(int appointmentId);

    List<AppointmentDoctorViewResponse> getDoctorAppointments();

    List<AppointmentManagerViewResponse> getAllAppointmentsForManager();

    List<AvailableDoctorResponse> getAvailableDoctorsForAppointment(int appointmentId);

    AssignDoctorResponse assignAnotherDoctor(AssignDoctorRequest request);
}