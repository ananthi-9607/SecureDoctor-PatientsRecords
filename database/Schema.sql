create database securedoctorpatientrecors;
use securedoctorpatientrecors;
create table users(user_id int primary key,Name varchar(50),email varchar(40),password_hash varchar(20),Role varchar(20),Phone int,Status varchar(20),created_at date);
create table Appointments(appointment_id int,doctor_id int,patient_id int,appointment_date date,appointment_time datetime,status varchar(20));
alter table Appointments
add primary key (appointment_id);
create table Prescriptions(prescript_id int primary key,consult_id int,medicine_name varchar(20),instruction varchar(100));
create table consultation(consult_id int primary key,appointment_id int,diagnosis varchar(20),encrypted_notes varchar(50), consultation_date date);
create table medicalreports(record_id int primary key,patient_id int,report_name varchar(60),encrypted_file varchar(60),upload_date date);
create table AuditLogs(log_id int primary key,user_id int,action varchar(100),ip_address varchar(70),timestamp datetime);
ALTER TABLE users
MODIFY user_id INT NOT NULL AUTO_INCREMENT;
ALTER TABLE consultation
MODIFY consult_id INT NOT NULL AUTO_INCREMENT;
ALTER TABLE appointments
MODIFY appointment_id INT NOT NULL AUTO_INCREMENT;
ALTER TABLE prescriptions
MODIFY prescript_id INT NOT NULL AUTO_INCREMENt;
ALTER TABLE medicalreports
MODIFY record_id INT NOT NULL AUTO_INCREMENT;
ALTER TABLE auditlogs
MODIFY log_id INT NOT NULL AUTO_INCREMENT;
describe Appointments;
ALTER TABLE appointments
ADD CONSTRAINT fk_doctor
FOREIGN KEY (doctor_id)
REFERENCES users(user_id);
ALTER TABLE appointments
ADD CONSTRAINT fk_patient
FOREIGN KEY (patient_id)
REFERENCES users(user_id);
ALTER TABLE consultation
ADD CONSTRAINT fk_appointment
FOREIGN KEY (appointment_id)
REFERENCES appointments(appointment_id);
ALTER TABLE prescriptions
ADD CONSTRAINT fk_consultation
FOREIGN KEY (consult_id)
REFERENCES consultation(consult_id);
ALTER TABLE medicalreports
ADD CONSTRAINT fk_medical_patient
FOREIGN KEY (patient_id)
REFERENCES users(user_id);
ALTER TABLE auditlogs
ADD CONSTRAINT fk_audit_user
FOREIGN KEY (user_id)
REFERENCES users(user_id);
INSERT INTO users(Name,email,password_hash,Role,phone,Status)
VALUES
('Dr. Arun','arun@gmail.com','test123','Doctor','9876543210','Active');

INSERT INTO users(Name,email,password_hash,role,phone,status)
VALUES
('Ananthi','ananthi@gmail.com','test123','Patient','9876543211','Active');
alter table Appointments
modify appointment_date date;
alter table users
drop  column created_at;
select *from users;
INSERT INTO appointments
(doctor_id, patient_id, appointment_date, appointment_time, status)
VALUES
(1, 2, '2026-08-10', '10:00:00', 'Booked');
describe Appointments;
select*from Appointments;
INSERT INTO Appointments
(doctor_id, patient_id, appointment_date, appointment_time, status)
VALUES
(100, 2, '2026-08-10', '10:00:00', 'Booked');
INSERT INTO consultation
(appointment_id, diagnosis, encrypted_notes, consultation_date)
VALUES
(1, 'Fever', 'Encrypted Text', '2026-08-10');
INSERT INTO prescriptions
(consult_id, medicine_name, instruction,dosage)
VALUES
(1, 'Paracetamol', 'Twice daily after food','500 mg');
alter table prescriptions
add column dosage varchar(20);
select*from prescriptions;
INSERT INTO medicalreports
(patient_id, report_name, encrypted_file, upload_date)
VALUES
(2, 'Blood Test', 'Encrypted PDF', '2026-08-10');
INSERT INTO auditlogs
(user_id, action, ip_address, timestamp)
VALUES
(2, 'LOGIN', '192.168.1.10', NOW());
SELECT * FROM users;
SELECT * FROM appointments;
SELECT * FROM consultation;
SELECT * FROM prescriptions;
SELECT * FROM medicalreports;
SELECT * FROM auditlogs;
