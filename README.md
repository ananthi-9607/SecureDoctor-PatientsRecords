WORKFLOW :

Patient Registers
        │
        ▼
Patient Logs In
        │
        ▼
Books Appointment
        │
        ▼
Doctor Views Appointment
        │
        ▼
Doctor Adds Consultation Notes
        │
        ▼
System Encrypts Data
        │
        ▼
Data Stored Securely
        │
        ▼
Doctor Uploads Prescription
        │
        ▼
Patient Views Prescription


USE CASE DIAGRAM:

Actors:

Admin
Doctor
Patient

Patient Use Cases :

Register
Login
Book Appointment
Upload Medical Report
View Prescription
View Consultation History

Doctor Use Cases :

Login
View Appointments
View Patient Records
Add Consultation Notes
Upload Prescription

Admin Use Cases

Manage Doctors
Manage Patients
View Audit Logs
Generate Reports



 Live Demo :

Frontend:https://secure-doctor-frontend.onrender.com
Backend API: https://securedoctor-patientsrecords-1.onrender.com

Technologies Used :

Frontend: React, Vite
Backend: Java, Spring Boot
Database: MySQL
Deployment: Render, Aiven

