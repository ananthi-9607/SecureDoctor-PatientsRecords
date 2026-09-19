package com.SecureDoctor_Patients.Records.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SecureDoctor_Patients.Records.backend.entity.Appointment;
import com.SecureDoctor_Patients.Records.backend.entity.Consultation;
import com.SecureDoctor_Patients.Records.backend.repository.AppointmentRepository;
import com.SecureDoctor_Patients.Records.backend.repository.ConsultationRepository;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;
    private final EncryptionService encryptionService;
    private final AuditLogService auditLogService;


    // =========================
    // CONSTRUCTOR
    // =========================

    public ConsultationService(
            ConsultationRepository consultationRepository,
            AppointmentRepository appointmentRepository,
            EncryptionService encryptionService,
            AuditLogService auditLogService) {

        this.consultationRepository =
                consultationRepository;

        this.appointmentRepository =
                appointmentRepository;

        this.encryptionService =
                encryptionService;

        this.auditLogService =
                auditLogService;
    }


    // =========================
    // CREATE CONSULTATION
    // =========================

    @Transactional
    public Consultation createConsultation(
            Consultation consultation) {

        // CHECK NULL CONSULTATION

        if (consultation == null) {

            throw new IllegalArgumentException(
                    "Consultation details cannot be null"
            );
        }


        // CHECK APPOINTMENT ID

        if (consultation.getAppointmentId() == null) {

            throw new IllegalArgumentException(
                    "Appointment ID is required"
            );
        }


        // =========================
        // CHECK APPOINTMENT EXISTS
        // =========================

        appointmentRepository
                .findById(
                        consultation.getAppointmentId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Appointment not found"
                        )
                );


        // =========================
        // PREVENT DUPLICATE
        // CONSULTATION
        // =========================

        Optional<Consultation> existingConsultation =
                consultationRepository
                        .findByAppointmentId(
                                consultation.getAppointmentId()
                        );

        if (existingConsultation.isPresent()) {

            throw new IllegalArgumentException(
                    "Consultation already exists for this appointment"
            );
        }


        // =========================
        // SET CONSULTATION DATE
        // =========================

        if (consultation.getConsultationDate() == null) {

            consultation.setConsultationDate(
                    LocalDate.now()
            );
        }


        // =========================
        // ENCRYPT DIAGNOSIS
        // =========================

        consultation.setDiagnosis(
                encryptionService.encrypt(
                        consultation.getDiagnosis()
                )
        );


        // =========================
        // ENCRYPT NOTES
        // =========================

        consultation.setEncryptedNotes(
                encryptionService.encrypt(
                        consultation.getEncryptedNotes()
                )
        );


        // =========================
        // SAVE ENCRYPTED DATA
        // =========================

        Consultation savedConsultation =
                consultationRepository.save(
                        consultation
                );


        // =========================
        // AUDIT LOG
        // =========================

        auditLogService.logAction(
                null,
                "CREATE CONSULTATION",
                "127.0.0.1"
        );


        return savedConsultation;
    }


    // =========================
    // GET CONSULTATION BY
    // APPOINTMENT ID
    // =========================

    @Transactional(readOnly = true)
    public Consultation getConsultationByAppointment(
            Long appointmentId) {

        Consultation consultation =
                consultationRepository
                        .findByAppointmentId(
                                appointmentId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Consultation not found"
                                )
                        );


        // =========================
        // DECRYPT DATA
        // =========================

        decryptConsultation(
                consultation
        );


        return consultation;
    }


    // =========================
    // GET CONSULTATIONS BY
    // PATIENT ID
    // =========================

    @Transactional(readOnly = true)
    public List<Consultation>
    getConsultationsByPatient(
            Long patientId) {

        // GET ALL APPOINTMENTS
        // FOR THIS PATIENT

        List<Appointment> appointments =
                appointmentRepository
                        .findByPatientId(
                                patientId
                        );


        // GET CONSULTATION FOR
        // EACH APPOINTMENT

        List<Consultation> consultations =
                appointments.stream()

                        .map(appointment ->
                                consultationRepository
                                        .findByAppointmentId(
                                                appointment
                                                        .getAppointmentId()
                                        )
                                        .orElse(null)
                        )

                        .filter(
                                consultation ->
                                        consultation != null
                        )

                        .collect(
                                Collectors.toList()
                        );


        // =========================
        // DECRYPT ALL CONSULTATIONS
        // =========================

        consultations.forEach(
                this::decryptConsultation
        );


        return consultations;
    }


    // =========================
    // DECRYPT CONSULTATION
    // =========================

    private void decryptConsultation(
            Consultation consultation) {

        consultation.setDiagnosis(
                encryptionService.decrypt(
                        consultation.getDiagnosis()
                )
        );

        consultation.setEncryptedNotes(
                encryptionService.decrypt(
                        consultation.getEncryptedNotes()
                )
        );
    }
}