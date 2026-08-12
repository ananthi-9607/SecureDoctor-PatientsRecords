import { useState } from "react";

function Appointment() {

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [status, setStatus] = useState("Booked");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: Number(doctorId),
            patientId: Number(patientId),
            appointmentDate,
            appointmentTime: appointmentTime + ":00",
            status,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log("Appointment created:", data);

        alert("Appointment booked successfully!");

        setDoctorId("");
        setPatientId("");
        setAppointmentDate("");
        setAppointmentTime("");
        setStatus("Booked");
      } else {
        const errorText = await response.text();

        console.error("Appointment failed:", errorText);

        alert("Appointment booking failed!");
      }

    } catch (error) {
      console.error("Backend connection error:", error);

      alert("Backend connection failed!");
    }
  };

  return (
    <div className="appointment-page">

      <div className="appointment-card">

        <h2>Book Appointment</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Doctor ID</label>

            <input
              type="number"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Patient ID</label>

            <input
              type="number"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Date</label>

            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Time</label>

            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Booked">Booked</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit">
            Book Appointment
          </button>

        </form>

      </div>

    </div>
  );
}

export default Appointment;