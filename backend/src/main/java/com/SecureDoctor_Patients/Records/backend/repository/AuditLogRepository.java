package com.SecureDoctor_Patients.Records.backend.repository;

import com.SecureDoctor_Patients.Records.backend.entity.AuditLog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

}