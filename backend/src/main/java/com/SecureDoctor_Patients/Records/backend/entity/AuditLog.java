package com.SecureDoctor_Patients.Records.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditlogs")
public class AuditLog {

    // =========================
    // LOG ID
    // =========================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;


    // =========================
    // USER ID
    // =========================

    @Column(name = "user_id")
    private Long userId;


    // =========================
    // ACTION
    // =========================

    @Column(name = "action", nullable = false)
    private String action;


    // =========================
    // IP ADDRESS
    // =========================

    @Column(name = "ip_address")
    private String ipAddress;


    // =========================
    // TIMESTAMP
    // =========================

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;


    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }


    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }


    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}