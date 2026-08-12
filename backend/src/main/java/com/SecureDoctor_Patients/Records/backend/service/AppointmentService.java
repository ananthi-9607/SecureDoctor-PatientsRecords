package com.SecureDoctor_Patients.Records.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.SecureDoctor_Patients.Records.backend.entity.Appointment;
import com.SecureDoctor_Patients.Records.backend.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // Create appointment
    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // Get all appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Get appointment by ID
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    // Update appointment
    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {

        Optional<Appointment> existingAppointment =
                appointmentRepository.findById(id);

        if (existingAppointment.isPresent()) {

            Appointment appointment = existingAppointment.get();

            appointment.setDoctorId(appointmentDetails.getDoctorId());
            appointment.setPatientId(appointmentDetails.getPatientId());
            appointment.setAppointmentDate(
                    appointmentDetails.getAppointmentDate()
            );
            appointment.setAppointmentTime(
                    appointmentDetails.getAppointmentTime()
            );
            appointment.setStatus(appointmentDetails.getStatus());

            return appointmentRepository.save(appointment);
        }

        return null;
    }

    // Delete appointment
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}