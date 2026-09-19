package com.SecureDoctor_Patients.Records.backend.service;

import com.SecureDoctor_Patients.Records.backend.entity.AuditLog;
import com.SecureDoctor_Patients.Records.backend.repository.AuditLogRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    // =========================
    // CONSTRUCTOR
    // =========================

    public AuditLogService(
            AuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;
    }


    // =========================
    // CREATE AUDIT LOG
    // =========================

    public void logAction(
            Long userId,
            String action,
            String ipAddress) {

        AuditLog auditLog = new AuditLog();

        auditLog.setUserId(userId);

        auditLog.setAction(action);

        auditLog.setIpAddress(ipAddress);

        auditLog.setTimestamp(
                LocalDateTime.now()
        );

        auditLogRepository.save(auditLog);
    }
}