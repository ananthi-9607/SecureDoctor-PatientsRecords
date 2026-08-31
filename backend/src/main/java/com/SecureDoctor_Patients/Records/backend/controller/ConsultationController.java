package com.SecureDoctor_Patients.Records.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SecureDoctor_Patients.Records.backend.entity.Consultation;
import com.SecureDoctor_Patients.Records.backend.service.ConsultationService;

@RestController
@RequestMapping("/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(
            ConsultationService consultationService) {

        this.consultationService =
                consultationService;
    }

    // =========================
    // CREATE CONSULTATION
    // =========================

    @PostMapping
    public ResponseEntity<Consultation>
            createConsultation(
                    @RequestBody Consultation consultation) {

        Consultation savedConsultation =
                consultationService
                        .createConsultation(
                                consultation
                        );

        return new ResponseEntity<>(
                savedConsultation,
                HttpStatus.CREATED
        );
    }


    // =========================
    // GET CONSULTATION BY
    // APPOINTMENT ID
    // =========================

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Consultation>
            getConsultationByAppointment(
                    @PathVariable Long appointmentId) {

        Consultation consultation =
                consultationService
                        .getConsultationByAppointment(
                                appointmentId
                        );

        return ResponseEntity.ok(
                consultation
        );
    }


    // =========================
    // GET ALL CONSULTATIONS
    // FOR A PATIENT
    // =========================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Consultation>>
            getConsultationsByPatient(
                    @PathVariable Long patientId) {

        List<Consultation> consultations =
                consultationService
                        .getConsultationsByPatient(
                                patientId
                        );

        return ResponseEntity.ok(
                consultations
        );
    }
}