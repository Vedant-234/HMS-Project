package com.hms.hms_backend.servicesImpl;

import com.hms.hms_backend.daos.AppointmentDao;
import com.hms.hms_backend.entities.Appointment;
import com.hms.hms_backend.entities.AppointmentStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentStatusScheduler {

    private final AppointmentDao appointmentDao;

    public AppointmentStatusScheduler(AppointmentDao appointmentDao) {
        this.appointmentDao = appointmentDao;
    }

    // ⏱ Runs every 1 minute
    @Scheduled(fixedRate = 60000)
    public void moveScheduledToInProgress() {

        LocalDateTime now = LocalDateTime.now();

        List<Appointment> appointments =
                appointmentDao.findByStatusAndScheduledAtLessThanEqual(
                        AppointmentStatus.SCHEDULED,
                        now
                );

        for (Appointment appointment : appointments) {
            appointment.setStatus(AppointmentStatus.IN_PROGRESS);
        }

        appointmentDao.saveAll(appointments);
    }
}