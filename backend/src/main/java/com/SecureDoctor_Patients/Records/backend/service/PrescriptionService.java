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
        // ENCRYPT MEDICINE NAME 🔐
        // =========================

        prescription.setMedicineName(
                encryptionService.encrypt(
                        prescription.getMedicineName()
                )
        );


        // =========================
        // ENCRYPT DOSAGE 🔐
        // =========================

        if (prescription.getDosage() != null &&
            !prescription.getDosage().isBlank()) {

            prescription.setDosage(
                    encryptionService.encrypt(
                            prescription.getDosage()
                    )
            );
        }


        // =========================
        // ENCRYPT INSTRUCTION 🔐
        // =========================

        if (prescription.getInstruction() != null &&
            !prescription.getInstruction().isBlank()) {

            prescription.setInstruction(
                    encryptionService.encrypt(
                            prescription.getInstruction()
                    )
            );
        }


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

    public List<Prescription>
    getPrescriptionsByConsultation(
            Integer consultId) {

        List<Prescription> prescriptions =
                prescriptionRepository
                        .findAllByConsultId(consultId);


        // DECRYPT ALL PRESCRIPTIONS 🔓
        prescriptions.forEach(
                this::decryptPrescription
        );


        return prescriptions;
    }


    // =========================
    // DECRYPT PRESCRIPTION
    // =========================

    private void decryptPrescription(
            Prescription prescription) {

        // DECRYPT MEDICINE NAME
        prescription.setMedicineName(
                encryptionService.decrypt(
                        prescription.getMedicineName()
                )
        );


        // DECRYPT DOSAGE
        if (prescription.getDosage() != null &&
            !prescription.getDosage().isBlank()) {

            prescription.setDosage(
                    encryptionService.decrypt(
                            prescription.getDosage()
                    )
            );
        }


        // DECRYPT INSTRUCTION
        if (prescription.getInstruction() != null &&
            !prescription.getInstruction().isBlank()) {

            prescription.setInstruction(
                    encryptionService.decrypt(
                            prescription.getInstruction()
                    )
            );
        }
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