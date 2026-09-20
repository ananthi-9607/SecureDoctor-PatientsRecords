package com.SecureDoctor_Patients.Records.backend.service;

import com.SecureDoctor_Patients.Records.backend.entity.Prescription;
import com.SecureDoctor_Patients.Records.backend.repository.PrescriptionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final EncryptionService encryptionService;

    // =========================
    // CONSTRUCTOR
    // =========================

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            EncryptionService encryptionService) {

        this.prescriptionRepository = prescriptionRepository;
        this.encryptionService = encryptionService;
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
        // ENCRYPT PRESCRIPTION DATA 🔐
        // =========================

        prescription.setMedicineName(
                encryptionService.encrypt(
                        prescription.getMedicineName()
                )
        );

        prescription.setInstruction(
                encryptionService.encrypt(
                        prescription.getInstruction()
                )
        );

        prescription.setDosage(
                encryptionService.encrypt(
                        prescription.getDosage()
                )
        );

        // =========================
        // SAVE ENCRYPTED DATA
        // =========================

        return prescriptionRepository.save(
                prescription
        );
    }

    // =========================
    // GET PRESCRIPTIONS
    // =========================

    public List<Prescription> getPrescriptionsByConsultation(
            Integer consultId) {

        List<Prescription> prescriptions =
                prescriptionRepository
                        .findAllByConsultId(consultId);

        // =========================
        // DECRYPT DATA 🔓
        // =========================

        prescriptions.forEach(prescription -> {

            prescription.setMedicineName(
                    encryptionService.decrypt(
                            prescription.getMedicineName()
                    )
            );

            prescription.setInstruction(
                    encryptionService.decrypt(
                            prescription.getInstruction()
                    )
            );

            prescription.setDosage(
                    encryptionService.decrypt(
                            prescription.getDosage()
                    )
            );
        });

        return prescriptions;
    }

    // =========================
    // DELETE PRESCRIPTION
    // =========================

    public void deletePrescription(
            Integer prescriptId) {

        if (!prescriptionRepository
                .existsById(prescriptId)) {

            throw new RuntimeException(
                    "Prescription not found"
            );
        }

        prescriptionRepository.deleteById(
                prescriptId
        );
    }
}