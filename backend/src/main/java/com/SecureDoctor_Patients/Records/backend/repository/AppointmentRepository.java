package com.SecureDoctor_Patients.Records.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SecureDoctor_Patients.Records.backend.entity.Appointment;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // Check appointments for a doctor on a particular date and time
    List<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTime(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime
    );
    // Get all appointments for a doctor
    List<Appointment> findByDoctorId(Long doctorId);
}
