package com.SecureDoctor_Patients.Records.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescript_id")
    private Integer prescriptId;

    @Column(name = "consult_id")
    private Integer consultId;

    @Column(name = "medicine_name")
    private String medicineName;

    @Column(name = "instruction")
    private String instruction;

    @Column(name = "dosage")
    private String dosage;

    public Integer getPrescriptId() {
        return prescriptId;
    }

    public void setPrescriptId(Integer prescriptId) {
        this.prescriptId = prescriptId;
    }

    public Integer getConsultId() {
        return consultId;
    }

    public void setConsultId(Integer consultId) {
        this.consultId = consultId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }
}