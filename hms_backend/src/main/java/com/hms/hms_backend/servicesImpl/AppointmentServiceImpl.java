package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.AppointmentDao;
import com.hms.hms_backend.daos.DoctorDao;
import com.hms.hms_backend.daos.PatientDao;
import com.hms.hms_backend.daos.ManagerDao;
import com.hms.hms_backend.dtos.request.AssignDoctorRequest;
import com.hms.hms_backend.dtos.request.BookAppointmentRequest;
import com.hms.hms_backend.dtos.response.*;
import com.hms.hms_backend.entities.*;
import com.hms.hms_backend.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentDao appointmentDao;

    @Autowired
    private PatientDao patientDao;

    @Autowired
    private DoctorDao doctorDao;

    @Autowired
    private ManagerDao managerDao;

    // =======================
    // BOOK APPOINTMENT
    // =======================
    @Override
    public AppointmentStatusResponse bookAppointment(BookAppointmentRequest request) {

        UserAccount loggedInUser = (UserAccount) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();


        Patient patient = patientDao
                .findByUserAccount(loggedInUser)
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));


        Doctor doctor = doctorDao
                .findByName(request.getDoctorName())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        if (doctor.getStatus() != DoctorStatus.ACTIVE) {
            throw new RuntimeException(
                    "Appointment cannot be booked. Doctor is not ACTIVE"
            );
        }


        boolean alreadyBooked = appointmentDao
                .existsByDoctorAndScheduledAt(
                        doctor,
                        request.getScheduledAt()
                );

        if (alreadyBooked) {
            throw new RuntimeException("Appointment slot already booked");
        }

        // 📅 Create appointment
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setScheduledAt(request.getScheduledAt());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setNotes(request.getNotes());

        appointmentDao.save(appointment);

        return new AppointmentStatusResponse(appointment.getStatus());
    }

    // =======================
    // VIEW MY APPOINTMENTS
    // =======================
    @Override
    public List<AppointmentViewResponse> getMyAppointments() {

        UserAccount loggedInUser = (UserAccount)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();


        Patient patient = patientDao
                .findByUserAccount(loggedInUser)
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));


        List<Appointment> appointments =
                appointmentDao.findByPatient(patient);


        return appointments.stream()
                .map(a -> new AppointmentViewResponse(
                        a.getAppointmentId(),   // correct getter
                        a.getDoctor().getName(),
                        a.getScheduledAt(),
                        a.getStatus()
                ))
                .toList();
    }

    // =======================
    // CANCEL APPOINTMENT
    // =======================
    @Override
    public AppointmentStatusResponse cancelAppointment(int appointmentId) {

        UserAccount loggedInUser = (UserAccount)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();


        Patient patient = patientDao
                .findByUserAccount(loggedInUser)
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));



        Appointment appointment = appointmentDao
                .findByAppointmentIdAndPatient(appointmentId, patient)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));


        if (appointment.getStatus() != AppointmentStatus.SCHEDULED) {
            throw new RuntimeException("Only scheduled appointments can be cancelled");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime scheduledTime = appointment.getScheduledAt();

        if (scheduledTime.isBefore(now)) {
            throw new RuntimeException("Past appointments cannot be cancelled");
        }

        long hoursDifference = Duration.between(now, scheduledTime).toHours();

        if (hoursDifference < 12) {
            throw new RuntimeException(
                    "Appointment can be cancelled only 12 hours before scheduled time"
            );
        }


        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentDao.save(appointment);


        return new AppointmentStatusResponse(appointment.getStatus());
    }

    @Override
    public AppointmentStatusResponse completeAppointment(int appointmentId) {


        UserAccount loggedInUser = (UserAccount)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        Doctor doctor = doctorDao
                .findByUserAccount(loggedInUser)
                .orElseThrow(() ->
                        new RuntimeException("Doctor profile not found"));


        Appointment appointment = appointmentDao
                .findByAppointmentIdAndDoctor(appointmentId, doctor)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));


        if (appointment.getStatus() != AppointmentStatus.IN_PROGRESS) {
            throw new RuntimeException(
                    "Only INPROGRESS appointments can be completed"
            );
        }

        appointment.setStatus(AppointmentStatus.ATTENDED);
        appointmentDao.save(appointment);

        return new AppointmentStatusResponse(appointment.getStatus());
    }

    @Override
    public List<AppointmentDoctorViewResponse> getDoctorAppointments() {

        // 🔐 Get logged-in user
        UserAccount loggedInUser = (UserAccount)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        // 👨‍⚕️ Fetch doctor profile
        Doctor doctor = doctorDao
                .findByUserAccount(loggedInUser)
                .orElseThrow(() ->
                        new RuntimeException("Doctor profile not found"));

        // 📅 Fetch appointments
        List<Appointment> appointments =
                appointmentDao.findByDoctor(doctor);

        // 🔁 Map to response
        return appointments.stream()
                .map(a -> new AppointmentDoctorViewResponse(
                        a.getAppointmentId(),                // ✅ correct getter
                        a.getScheduledAt(),
                        a.getPatient().getFirstname() + " " +
                                a.getPatient().getLastname(),
                        a.getPatient().getPatientid(),
                        a.getNotes(),
                        a.getStatus()
                ))
                .toList();
    }
    @Override
    public List<AppointmentManagerViewResponse> getAllAppointmentsForManager() {

        List<Appointment> appointments = appointmentDao.findAllByOrderByScheduledAtDesc();

        return appointments.stream()
                .map(a -> new AppointmentManagerViewResponse(
                        a.getAppointmentId(),                     // getter must exist
                        a.getScheduledAt(),
                        a.getPatient().getFirstname() + " " + a.getPatient().getLastname(),
                        a.getDoctor().getName(),
                        a.getNotes(),
                        a.getStatus()
                ))
                .toList();
    }

    @Override
    public List<AvailableDoctorResponse> getAvailableDoctorsForAppointment(int appointmentId) {

        Appointment appointment = appointmentDao.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Doctor currentDoctor = appointment.getDoctor();
        String speciality = currentDoctor.getSpeciality();

        // 1️⃣ Get all ACTIVE doctors of same speciality
        List<Doctor> doctors = doctorDao.findBySpecialityAndStatus(speciality, DoctorStatus.ACTIVE);

        // 2️⃣ Filter only those who are free at that scheduled time
        return doctors.stream()
                .filter(d -> d.getDoctorid() != currentDoctor.getDoctorid()) // remove current doctor
                .filter(d -> !appointmentDao.existsByDoctorAndScheduledAt(d, appointment.getScheduledAt())) // no clash
                .map(d -> new AvailableDoctorResponse(
                        d.getDoctorid(),
                        d.getName(),
                        d.getSpeciality(),
                        d.getMobile()
                ))
                .toList();
    }

    @Override
    public AssignDoctorResponse assignAnotherDoctor(AssignDoctorRequest request) {

        // 1️⃣ Fetch appointment
        Appointment appointment = appointmentDao.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Doctor oldDoctor = appointment.getDoctor();

        // 2️⃣ Fetch new doctor
        Doctor newDoctor = doctorDao.findById(request.getNewDoctorId())
                .orElseThrow(() -> new RuntimeException("New doctor not found"));

        // ✅ Doctor must be ACTIVE
        if (newDoctor.getStatus() != DoctorStatus.ACTIVE) {
            throw new RuntimeException("Doctor is not ACTIVE, cannot assign");
        }

        // ✅ Same doctor check
        if (oldDoctor.getDoctorid() == newDoctor.getDoctorid()) {
            throw new RuntimeException("Old doctor and new doctor cannot be same");
        }

        // ✅ Speciality must be same
        if (!oldDoctor.getSpeciality().equalsIgnoreCase(newDoctor.getSpeciality())) {
            throw new RuntimeException("Cannot assign new doctor of different speciality");
        }

        // ✅ Slot clash check (same scheduled time)
        boolean alreadyBooked = appointmentDao.existsByDoctorAndScheduledAt(
                newDoctor,
                appointment.getScheduledAt()
        );

        if (alreadyBooked) {
            throw new RuntimeException("Selected doctor already has an appointment at this time");
        }

        // 3️⃣ Assign new doctor
        appointment.setDoctor(newDoctor);

        appointmentDao.save(appointment);

        return new AssignDoctorResponse(
                appointment.getAppointmentId(),
                oldDoctor.getName(),
                newDoctor.getName(),
                "Doctor reassigned successfully"
        );
    }



}