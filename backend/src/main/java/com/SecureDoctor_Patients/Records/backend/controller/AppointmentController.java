package com.SecureDoctor_Patients.Records.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.SecureDoctor_Patients.Records.backend.entity.Appointment;
import com.SecureDoctor_Patients.Records.backend.service.AppointmentService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // CREATE APPOINTMENT
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody Appointment appointment) {

        Appointment savedAppointment =
                appointmentService.saveAppointment(appointment);

        return new ResponseEntity<>(
                savedAppointment,
                HttpStatus.CREATED
        );
    }

    // GET ALL APPOINTMENTS
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {

        return ResponseEntity.ok(
                appointmentService.getAllAppointments()
        );
    }

    // GET APPOINTMENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(
            @PathVariable Long id) {

        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }
    // =========================
// GET APPOINTMENTS BY DOCTOR
// =========================

@GetMapping("/doctor/{doctorId}")
public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(
        @PathVariable Long doctorId) {

    return ResponseEntity.ok(
            appointmentService.getAppointmentsByDoctor(doctorId)
    );
}
// =========================
// GET APPOINTMENTS BY PATIENT
// =========================

@GetMapping("/patient/{patientId}")
public ResponseEntity<List<Appointment>> getAppointmentsByPatient(
        @PathVariable Long patientId) {

    return ResponseEntity.ok(
            appointmentService.getAppointmentsByPatient(patientId)
    );
}

    // UPDATE APPOINTMENT
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointmentDetails) {

        Appointment updatedAppointment =
                appointmentService.updateAppointment(
                        id,
                        appointmentDetails
                );

        if (updatedAppointment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedAppointment);
    }
    @PutMapping("/{id}/status")
public ResponseEntity<Appointment> updateAppointmentStatus(
        @PathVariable Long id,
        @RequestParam String status) {

    Appointment updatedAppointment =
            appointmentService.updateAppointmentStatus(
                    id,
                    status
            );

    if (updatedAppointment != null) {
        return ResponseEntity.ok(updatedAppointment);
    }

    return ResponseEntity.notFound().build();
}


    // DELETE APPOINTMENT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(
            @PathVariable Long id) {

        if (appointmentService.getAppointmentById(id).isPresent()) {

            appointmentService.deleteAppointment(id);

            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}