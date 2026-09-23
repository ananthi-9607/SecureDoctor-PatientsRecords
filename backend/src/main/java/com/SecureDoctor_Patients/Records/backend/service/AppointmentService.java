package com.SecureDoctor_Patients.Records.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SecureDoctor_Patients.Records.backend.entity.Appointment;
import com.SecureDoctor_Patients.Records.backend.entity.User;
import com.SecureDoctor_Patients.Records.backend.repository.AppointmentRepository;
import com.SecureDoctor_Patients.Records.backend.repository.UserRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    // =========================
    // CONSTRUCTOR
    // =========================

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository) {

        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // CREATE APPOINTMENT
    // =========================

    @Transactional
    public Appointment saveAppointment(
            Appointment appointment) {

        // =========================
        // BASIC VALIDATION
        // =========================

        if (appointment == null) {
            throw new IllegalArgumentException(
                    "Appointment cannot be null"
            );
        }

        if (appointment.getDoctorId() == null) {
            throw new IllegalArgumentException(
                    "Doctor is required"
            );
        }

        if (appointment.getPatientId() == null) {
            throw new IllegalArgumentException(
                    "Patient is required"
            );
        }

        if (appointment.getAppointmentDate() == null) {
            throw new IllegalArgumentException(
                    "Appointment date is required"
            );
        }

        if (appointment.getAppointmentTime() == null) {
            throw new IllegalArgumentException(
                    "Appointment time is required"
            );
        }

        // =========================
        // CHECK DOCTOR
        // =========================

        Optional<User> doctor =
                userRepository.findById(
                        appointment.getDoctorId()
                );

        if (doctor.isEmpty()) {
            throw new IllegalArgumentException(
                    "Doctor not found"
            );
        }

        // =========================
        // CHECK DOCTOR ROLE
        // =========================

        if (!"Doctor".equalsIgnoreCase(
                doctor.get().getRole())) {

            throw new IllegalArgumentException(
                    "Selected user is not a doctor"
            );
        }

        // =========================
        // CHECK DOCTOR VERIFICATION
        // =========================

        if (!doctor.get().isVerified()) {

            throw new IllegalArgumentException(
                    "Doctor is not verified"
            );
        }

        // =========================
        // CHECK PATIENT
        // =========================

        Optional<User> patient =
                userRepository.findById(
                        appointment.getPatientId()
                );

        if (patient.isEmpty()) {
            throw new IllegalArgumentException(
                    "Patient not found"
            );
        }

        // =========================
        // CHECK PATIENT ROLE
        // =========================

        if (!"Patient".equalsIgnoreCase(
                patient.get().getRole())) {

            throw new IllegalArgumentException(
                    "Selected user is not a patient"
            );
        }

        // =========================
        // CHECK APPOINTMENT DATE
        // =========================

        if (appointment.getAppointmentDate()
                .isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Appointment date cannot be in the past"
            );
        }

        // =========================
        // CHECK DUPLICATE TIME SLOT
        // =========================

        List<Appointment> existingAppointments =
                appointmentRepository
                        .findByDoctorIdAndAppointmentDateAndAppointmentTime(
                                appointment.getDoctorId(),
                                appointment.getAppointmentDate(),
                                appointment.getAppointmentTime()
                        );

        if (!existingAppointments.isEmpty()) {

            throw new IllegalArgumentException(
                    "Doctor is already booked at this date and time"
            );
        }

        // =========================
        // DEFAULT STATUS
        // =========================

        if (appointment.getStatus() == null
                || appointment.getStatus().isBlank()) {

            appointment.setStatus("Booked");
        }

        // =========================
        // SAVE APPOINTMENT
        // =========================

        return appointmentRepository.save(
                appointment
        );
    }

    // =========================
    // GET ALL APPOINTMENTS
    // =========================

    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }

    // =========================
    // GET APPOINTMENT BY ID
    // =========================

    @Transactional(readOnly = true)
    public Optional<Appointment> getAppointmentById(
            Long id) {

        return appointmentRepository.findById(id);
    }

    // =========================
    // UPDATE APPOINTMENT
    // =========================

    @Transactional
    public Appointment updateAppointment(
            Long id,
            Appointment appointmentDetails) {

        Optional<Appointment> existingAppointment =
                appointmentRepository.findById(id);

        if (existingAppointment.isEmpty()) {
            return null;
        }

        Appointment appointment =
                existingAppointment.get();

        appointment.setDoctorId(
                appointmentDetails.getDoctorId()
        );

        appointment.setPatientId(
                appointmentDetails.getPatientId()
        );

        appointment.setAppointmentDate(
                appointmentDetails.getAppointmentDate()
        );

        appointment.setAppointmentTime(
                appointmentDetails.getAppointmentTime()
        );

        appointment.setStatus(
                appointmentDetails.getStatus()
        );

        return appointmentRepository.save(
                appointment
        );
    }

    // =========================
    // UPDATE APPOINTMENT STATUS
    // =========================

    @Transactional
    public Appointment updateAppointmentStatus(
            Long id,
            String status) {

        Optional<Appointment> existingAppointment =
                appointmentRepository.findById(id);

        if (existingAppointment.isPresent()) {

            Appointment appointment =
                    existingAppointment.get();

            appointment.setStatus(status);

            return appointmentRepository.save(
                    appointment
            );
        }

        return null;
    }

    // =========================
    // GET APPOINTMENTS BY DOCTOR
    // =========================

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByDoctor(
            Long doctorId) {

        return appointmentRepository.findByDoctorId(
                doctorId
        );
    }

    // =========================
    // GET APPOINTMENTS BY PATIENT
    // =========================

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByPatient(
            Long patientId) {

        return appointmentRepository.findByPatientId(
                patientId
        );
    }

    // =========================
    // DELETE APPOINTMENT
    // =========================

    @Transactional
    public void deleteAppointment(Long id) {

        appointmentRepository.deleteById(id);
    }
}