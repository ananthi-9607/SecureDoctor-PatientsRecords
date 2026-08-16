import { useEffect, useState } from "react";

function DoctorDashboard({ doctorId, doctorName }) {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  // =========================
// UPDATE APPOINTMENT STATUS
// =========================

const updateAppointmentStatus = async (
  appointmentId,
  newStatus
) => {

  try {

    const response = await fetch(
      `http://localhost:8080/appointments/${appointmentId}/status?status=${newStatus}`,
      {
        method: "PUT",
      }
    );

    if (response.ok) {

      const updatedAppointment =
        await response.json();

      console.log(
        "Appointment updated:",
        updatedAppointment
      );

      setAppointments((previousAppointments) =>
        previousAppointments.map(
          (appointment) =>
            appointment.appointmentId === appointmentId
              ? updatedAppointment
              : appointment
        )
      );

      alert(
        `Appointment ${newStatus.toLowerCase()} successfully!`
      );

    } else {

      const errorText =
        await response.text();

      console.error(
        "Status update failed:",
        errorText
      );

      alert(
        errorText ||
        "Unable to update appointment."
      );
    }

  } catch (error) {

    console.error(
      "Backend connection error:",
      error
    );

    alert(
      "Backend connection failed!"
    );
  }
};

  useEffect(() => {

    const fetchAppointments = async () => {

      try {

        const response = await fetch(
          `http://localhost:8080/appointments/doctor/${doctorId}`
        );

        if (response.ok) {

          const data = await response.json();

          setAppointments(data);

        } else {

          alert("Unable to load appointments.");
        }

      } catch (error) {

        console.error(error);

        alert("Backend connection failed!");

      } finally {

        setLoading(false);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }

  }, [doctorId]);


  // =========================
  // STATISTICS
  // =========================

  const totalAppointments = appointments.length;

  const bookedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Booked"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Confirmed"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Cancelled"
    ).length;


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="doctor-dashboard-page">

        <div className="dashboard-loading">
          Loading dashboard...
        </div>

      </div>
    );
  }


  return (

    <div className="doctor-dashboard-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="doctor-sidebar">

        <div className="doctor-logo">
          <h2>SecureDoctor</h2>
          <span>Doctor Portal</span>
        </div>

        <nav>

          <div className="sidebar-item active">
            🏠 Dashboard
          </div>

          <div className="sidebar-item">
            📅 Appointments
          </div>

          <div className="sidebar-item">
            👤 Patients
          </div>

          <div className="sidebar-item">
            📋 Medical Records
          </div>

        </nav>

        <div className="sidebar-footer">
          🔒 Secure & Private
        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="doctor-main">

        {/* HEADER */}

        <header className="doctor-header">

          <div>

            <h1>
              Doctor Dashboard
            </h1>

            <p>
              Manage your appointments and patients
              securely.
            </p>

          </div>


          <div className="doctor-profile">

            <div className="doctor-avatar">
              {doctorName
                ? doctorName.charAt(0).toUpperCase()
                : "D"}
            </div>

            <div>

              <strong>
                Dr. {doctorName}
              </strong>

              <span>
                Doctor
              </span>

            </div>

          </div>

        </header>


        {/* =========================
            WELCOME CARD
        ========================= */}

        <section className="doctor-welcome-card">

          <div>

            <span>
              Welcome back 👋
            </span>

            <h2>
              Dr. {doctorName}
            </h2>

            <p>
              Here's your appointment overview
              for today.
            </p>

          </div>

          <div className="welcome-icon">
            🩺
          </div>

        </section>


        {/* =========================
            STATISTICS
        ========================= */}

        <section className="doctor-stats">

          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <span>
                Total Appointments
              </span>

              <h2>
                {totalAppointments}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🕐
            </div>

            <div>

              <span>
                Booked
              </span>

              <h2>
                {bookedAppointments}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>

              <span>
                Confirmed
              </span>

              <h2>
                {confirmedAppointments}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✕
            </div>

            <div>

              <span>
                Cancelled
              </span>

              <h2>
                {cancelledAppointments}
              </h2>

            </div>

          </div>

        </section>


        {/* =========================
            APPOINTMENTS
        ========================= */}

        <section className="appointments-section">

          <div className="section-header">

            <div>

              <h2>
                Recent Appointments
              </h2>

              <p>
                Your scheduled patient appointments
              </p>

            </div>

          </div>


          {appointments.length === 0 ? (

            <div className="empty-appointments">

              <div>
                📅
              </div>

              <h3>
                No appointments yet
              </h3>

              <p>
                New patient appointments will
                appear here.
              </p>

            </div>

          ) : (

            <div className="appointment-table-container">

              <table className="appointment-table">

                <thead>

                  <tr>

                    <th>
                      Appointment
                    </th>

                    <th>
                      Patient ID
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Status
                    </th>
                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {appointments.map(
                    (appointment) => (

                      <tr
                        key={
                          appointment.appointmentId
                        }
                      >

                        <td>
                          <strong>
                            #
                            {
                              appointment.appointmentId
                            }
                          </strong>
                        </td>

                        <td>
                          Patient #
                          {
                            appointment.patientId
                          }
                        </td>

                        <td>
                          {
                            appointment.appointmentDate
                          }
                        </td>

                        <td>
                          {
                            appointment.appointmentTime
                          }
                        </td>

                        <td>

                          <span
                            className={`status-badge ${appointment.status?.toLowerCase()}`}
                          >
                            {appointment.status}
                          </span>

                        </td>
                        <td>

  {appointment.status === "Booked" && (

    <div className="appointment-actions">

      <button
        className="confirm-btn"
        onClick={() =>
          updateAppointmentStatus(
            appointment.appointmentId,
            "Confirmed"
          )
        }
      >
        Confirm
      </button>

      <button
        className="cancel-btn"
        onClick={() =>
          updateAppointmentStatus(
            appointment.appointmentId,
            "Cancelled"
          )
        }
      >
        Cancel
      </button>

    </div>

  )}

</td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default DoctorDashboard;