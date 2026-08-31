
package com.SecureDoctor_Patients.Records.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SecureDoctor_Patients.Records.backend.entity.Consultation;

@Repository
public interface ConsultationRepository
        extends JpaRepository<Consultation, Long> {

    // Get consultation using appointment ID
    Optional<Consultation> findByAppointmentId(Long appointmentId);

    // Get consultations for multiple appointments
    List<Consultation> findAllByAppointmentId(Long appointmentId);
}