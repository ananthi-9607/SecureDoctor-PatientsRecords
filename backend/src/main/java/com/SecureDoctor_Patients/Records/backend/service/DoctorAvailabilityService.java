package com.SecureDoctor_Patients.Records.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SecureDoctor_Patients.Records.backend.entity.DoctorAvailability;
import com.SecureDoctor_Patients.Records.backend.entity.User;
import com.SecureDoctor_Patients.Records.backend.repository.DoctorAvailabilityRepository;
import com.SecureDoctor_Patients.Records.backend.repository.UserRepository;

@Service
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    // =========================
    // CONSTRUCTOR
    // =========================

    public DoctorAvailabilityService(
            DoctorAvailabilityRepository availabilityRepository,
            UserRepository userRepository) {

        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // ADD AVAILABLE SLOT
    // =========================

    @Transactional
    public DoctorAvailability addAvailability(
            DoctorAvailability availability) {

        // Basic validation

        if (availability == null) {
            throw new IllegalArgumentException(
                    "Availability details cannot be null"
            );
        }

        if (availability.getDoctorId() == null) {
            throw new IllegalArgumentException(
                    "Doctor is required"
            );
        }

        if (availability.getAvailableDate() == null) {
            throw new IllegalArgumentException(
                    "Available date is required"
            );
        }

        if (availability.getAvailableTime() == null) {
            throw new IllegalArgumentException(
                    "Available time is required"
            );
        }


        // =========================
        // CHECK DOCTOR
        // =========================

        User doctor = userRepository
                .findById(availability.getDoctorId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Doctor not found"
                        )
                );


        if (!"Doctor".equalsIgnoreCase(
                doctor.getRole())) {

            throw new IllegalArgumentException(
                    "Selected user is not a doctor"
            );
        }


        // =========================
        // CHECK DATE
        // =========================

        if (availability.getAvailableDate()
                .isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Available date cannot be in the past"
            );
        }


        // =========================
        // CHECK DUPLICATE SLOT
        // =========================

        List<DoctorAvailability> existingSlots =
                availabilityRepository.findByDoctorId(
                        availability.getDoctorId()
                );

        boolean slotExists = existingSlots.stream()
                .anyMatch(slot ->
                        slot.getAvailableDate().equals(
                                availability.getAvailableDate()
                        )
                        &&
                        slot.getAvailableTime().equals(
                                availability.getAvailableTime()
                        )
                );

        if (slotExists) {
            throw new IllegalArgumentException(
                    "This time slot already exists"
            );
        }


        // =========================
        // DEFAULT AVAILABILITY
        // =========================

        if (availability.getIsAvailable() == null) {
            availability.setIsAvailable(true);
        }


        // =========================
        // SAVE SLOT
        // =========================

        return availabilityRepository.save(
                availability
        );
    }


    // =========================
    // GET ALL SLOTS FOR DOCTOR
    // =========================

    @Transactional(readOnly = true)
    public List<DoctorAvailability> getAvailabilityByDoctor(
            Long doctorId) {

        return availabilityRepository
                .findByDoctorId(doctorId);
    }


    // =========================
    // GET AVAILABLE SLOTS
    // =========================

    @Transactional(readOnly = true)
    public List<DoctorAvailability> getAvailableSlots(
            Long doctorId,
            LocalDate date) {

        return availabilityRepository
                .findByDoctorIdAndAvailableDateAndIsAvailableTrue(
                        doctorId,
                        date
                );
    }


    // =========================
    // DELETE SLOT
    // =========================

    @Transactional
    public void deleteAvailability(Long id) {

        if (!availabilityRepository.existsById(id)) {

            throw new IllegalArgumentException(
                    "Availability slot not found"
            );
        }

        availabilityRepository.deleteById(id);
    }


    // =========================
    // MARK SLOT AS BOOKED
    // =========================

    @Transactional
    public DoctorAvailability markSlotAsBooked(
            Long availabilityId) {

        DoctorAvailability availability =
                availabilityRepository
                        .findById(availabilityId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Availability slot not found"
                                )
                        );

        availability.setIsAvailable(false);

        return availabilityRepository.save(
                availability
        );
    }
}