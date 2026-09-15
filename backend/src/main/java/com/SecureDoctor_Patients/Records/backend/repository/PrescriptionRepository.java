package com.SecureDoctor_Patients.Records.backend.repository;

import com.SecureDoctor_Patients.Records.backend.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository
        extends JpaRepository<Prescription, Integer> {

    List<Prescription> findAllByConsultId(Integer consultId);
}