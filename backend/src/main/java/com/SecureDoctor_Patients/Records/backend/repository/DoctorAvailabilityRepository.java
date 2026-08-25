package com.SecureDoctor_Patients.Records.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SecureDoctor_Patients.Records.backend.entity.DoctorAvailability;

@Repository
public interface DoctorAvailabilityRepository
        extends JpaRepository<DoctorAvailability, Long> {

    // Get all availability slots for a doctor
    List<DoctorAvailability> findByDoctorId(Long doctorId);

    // Get available slots for a doctor on a specific date
    List<DoctorAvailability> findByDoctorIdAndAvailableDateAndIsAvailableTrue(
            Long doctorId,
            LocalDate availableDate
    );
}