package com.SecureDoctor_Patients.Records.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SecureDoctor_Patients.Records.backend.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}