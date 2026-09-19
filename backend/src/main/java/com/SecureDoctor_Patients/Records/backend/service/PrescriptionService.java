package com.SecureDoctor_Patients.Records.backend.service;

import com.SecureDoctor_Patients.Records.backend.entity.Prescription;
import com.SecureDoctor_Patients.Records.backend.repository.PrescriptionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AuditLogService auditLogService;


    // =========================
    // CONSTRUCTOR
    // =========================

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            AuditLogService auditLogService) {

        this.prescriptionRepository =
                prescriptionRepository;

        this.auditLogService =
                auditLogService;
    }


    // =========================
    // ADD PRESCRIPTION
    // =========================

    public Prescription addPrescription(
            Prescription prescription) {

        // CHECK CONSULTATION ID

        if (prescription.getConsultId() == null) {

            throw new RuntimeException(
                    "Consultation ID is required"
            );
        }


        // CHECK MEDICINE NAME

        if (prescription.getMedicineName() == null ||
            prescription.getMedicineName().isBlank()) {

            throw new RuntimeException(
                    "Medicine name is required"
            );
        }


        // =========================
        // SAVE PRESCRIPTION
        // =========================

        Prescription savedPrescription =
                prescriptionRepository.save(
                        prescription
                );


        // =========================
        // AUDIT LOG
        // =========================

        auditLogService.logAction(
                null,
                "CREATE PRESCRIPTION",
                "127.0.0.1"
        );


        return savedPrescription;
    }


    // =========================
    // GET PRESCRIPTIONS
    // =========================

    public List<Prescription>
    getPrescriptionsByConsultation(
            Integer consultId) {

        return prescriptionRepository
                .findAllByConsultId(consultId);
    }


    // =========================
    // DELETE PRESCRIPTION
    // =========================

    public void deletePrescription(
            Integer prescriptId) {


        // CHECK PRESCRIPTION EXISTS

        if (!prescriptionRepository
                .existsById(prescriptId)) {

            throw new RuntimeException(
                    "Prescription not found"
            );
        }


        // =========================
        // DELETE
        // =========================

        prescriptionRepository
                .deleteById(prescriptId);


        // =========================
        // AUDIT LOG
        // =========================

        auditLogService.logAction(
                null,
                "DELETE PRESCRIPTION",
                "127.0.0.1"
        );
    }
}