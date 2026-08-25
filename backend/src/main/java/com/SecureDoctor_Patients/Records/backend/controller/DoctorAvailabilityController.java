package com.SecureDoctor_Patients.Records.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.SecureDoctor_Patients.Records.backend.entity.DoctorAvailability;
import com.SecureDoctor_Patients.Records.backend.service.DoctorAvailabilityService;

@RestController
@RequestMapping("/availability")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    public DoctorAvailabilityController(
            DoctorAvailabilityService availabilityService) {

        this.availabilityService = availabilityService;
    }


    // =========================
    // ADD AVAILABILITY SLOT
    // =========================

    @PostMapping
    public ResponseEntity<DoctorAvailability> addAvailability(
            @RequestBody DoctorAvailability availability) {

        DoctorAvailability savedAvailability =
                availabilityService.addAvailability(availability);

        return new ResponseEntity<>(
                savedAvailability,
                HttpStatus.CREATED
        );
    }


    // =========================
    // GET ALL SLOTS FOR DOCTOR
    // =========================

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorAvailability>>
            getAvailabilityByDoctor(
                    @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                availabilityService
                        .getAvailabilityByDoctor(doctorId)
        );
    }


    // =========================
    // GET AVAILABLE SLOTS
    // =========================

    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<List<DoctorAvailability>>
            getAvailableSlots(
                    @PathVariable Long doctorId,
                    @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                availabilityService
                        .getAvailableSlots(
                                doctorId,
                                date
                        )
        );
    }


    // =========================
    // DELETE SLOT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(
            @PathVariable Long id) {

        availabilityService.deleteAvailability(id);

        return ResponseEntity.noContent().build();
    }
}