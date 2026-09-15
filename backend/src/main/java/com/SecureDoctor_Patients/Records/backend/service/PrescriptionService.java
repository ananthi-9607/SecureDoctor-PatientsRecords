package com.SecureDoctor_Patients.Records.backend.service;

import com.SecureDoctor_Patients.Records.backend.entity.Prescription;
import com.SecureDoctor_Patients.Records.backend.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public Prescription addPrescription(Prescription prescription) {

        if (prescription.getConsultId() == null) {
            throw new RuntimeException("Consultation ID is required");
        }

        if (prescription.getMedicineName() == null ||
            prescription.getMedicineName().isBlank()) {
            throw new RuntimeException("Medicine name is required");
        }

        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByConsultation(Integer consultId) {
        return prescriptionRepository.findAllByConsultId(consultId);
    }

    public void deletePrescription(Integer prescriptId) {
        if (!prescriptionRepository.existsById(prescriptId)) {
            throw new RuntimeException("Prescription not found");
        }

        prescriptionRepository.deleteById(prescriptId);
    }
}