package com.SecureDoctor_Patients.Records.backend.controller;

import com.SecureDoctor_Patients.Records.backend.entity.Prescription;
import com.SecureDoctor_Patients.Records.backend.service.PrescriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public ResponseEntity<Prescription> addPrescription(
            @RequestBody Prescription prescription) {

        Prescription saved =
                prescriptionService.addPrescription(prescription);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/consultation/{consultId}")
    public ResponseEntity<List<Prescription>> getPrescriptions(
            @PathVariable Integer consultId) {

        List<Prescription> prescriptions =
                prescriptionService
                        .getPrescriptionsByConsultation(consultId);

        return ResponseEntity.ok(prescriptions);
    }

    @DeleteMapping("/{prescriptId}")
    public ResponseEntity<String> deletePrescription(
            @PathVariable Integer prescriptId) {

        prescriptionService.deletePrescription(prescriptId);

        return ResponseEntity.ok("Prescription deleted successfully");
    }
}