
import { useEffect, useState } from "react";
import API_BASE_URL from "./api";

function Appointment({ patientId, patientName }) {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [status, setStatus] = useState("Booked");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    console.log("Appointment patientId:", patientId);
    console.log("Appointment patientName:", patientName);
  }, [patientId, patientName]);

  // LOAD DOCTORS
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/doctors`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch doctors:", errorText);
          alert("Unable to load doctors.");
          return;
        }

        const data = await response.json();
        console.log("Doctors:", data);
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Backend connection error:", error);
        alert("Backend connection failed while loading doctors!");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // BOOK APPOINTMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      alert("Please select a doctor.");
      return;
    }

    if (!patientId) {
      alert("Patient information not found. Please login again.");
      return;
    }

    if (!appointmentDate) {
      alert("Please select an appointment date.");
      return;
    }

    if (!appointmentTime) {
      alert("Please select an appointment time.");
      return;
    }

    setBooking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: Number(doctorId),
          patientId: Number(patientId),
          appointmentDate,
          appointmentTime: `${appointmentTime}:00`,
          status,
        }),
      });

      if (response.ok) {
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        console.log("Appointment created:", data);
        alert("Appointment booked successfully!");

        setDoctorId("");
        setAppointmentDate("");
        setAppointmentTime("");
        setStatus("Booked");
      } else {
        const errorText = await response.text();
        console.error("Appointment failed:", errorText);

        const message = errorText.toLowerCase();

        if (message.includes("doctor is not verified")) {
          alert(
            "Appointment cannot be booked.\n\nThe selected doctor is not verified."
          );
        } else if (message.includes("doctor not found")) {
          alert("Appointment cannot be booked.\n\nDoctor not found.");
        } else if (message.includes("not a doctor")) {
          alert("Appointment cannot be booked.\n\nSelected user is not a doctor.");
        } else if (message.includes("already booked")) {
          alert(
            "Appointment cannot be booked.\n\nDoctor is already booked at this date and time."
          );
        } else if (message.includes("past")) {
          alert(
            "Appointment cannot be booked.\n\nAppointment date cannot be in the past."
          );
        } else {
          alert(`Appointment booking failed.\n\n${errorText}`);
        }
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Backend connection failed! Please check the backend and database.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="appointment-page">
      <div className="appointment-card">
        <h2>Book Appointment</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Doctor</label>

            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              disabled={loadingDoctors || booking}
            >
              <option value="">
                {loadingDoctors ? "Loading doctors..." : "-- Select Doctor --"}
              </option>

              {doctors.map((doctor) => {
                const id =
                  doctor.userId ?? doctor.user_id ?? doctor.id;

                const name =
                  doctor.fullName ?? doctor.full_name ?? "Doctor";

                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Patient</label>
            <input type="text" value={patientName || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toLocaleDateString("en-CA")}
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
            <input type="text" value={status} readOnly />
          </div>

          <button type="submit" disabled={loadingDoctors || booking}>
            {booking ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Appointment;
