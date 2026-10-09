import { useEffect, useState } from "react";
import "./MyAppointments.css";
import API_BASE_URL from "./api";

function MyAppointments({
  patientId,
  patientName,
  onBookAppointment,
  onViewConsultations,
  onLogout,
}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // LOAD PATIENT APPOINTMENTS
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) {
        setAppointments([]);
        setLoading(false);
        setError("Patient ID is not available. Please log in again.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/appointments/patient/${patientId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load appointments. Status: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Patient appointments:", data);

        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setAppointments([]);
        setError(
          "Unable to load appointments. Please check the backend connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  // GET APPOINTMENT STATUS CLASS
  const getStatusClass = (status) => {
    const normalizedStatus = status?.toLowerCase() || "";

    if (normalizedStatus === "confirmed") {
      return "appointment-status confirmed";
    }

    if (normalizedStatus === "cancelled") {
      return "appointment-status cancelled";
    }

    if (normalizedStatus === "completed") {
      return "appointment-status completed";
    }

    return "appointment-status booked";
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Not available";

    try {
      const parsedDate = new Date(`${date}T00:00:00`);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  // FORMAT TIME
  const formatTime = (time) => {
    if (!time) return "Not available";

    try {
      const [hours, minutes] = time.split(":");

      const date = new Date();
      date.setHours(Number(hours), Number(minutes), 0, 0);

      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  // DASHBOARD COUNTS
  const totalAppointments = appointments.length;

  const confirmedAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "confirmed"
  ).length;

  const bookedAppointments = appointments.filter((appointment) => {
    const status = appointment.status?.toLowerCase();

    return status === "booked" || status === "pending";
  }).length;

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "cancelled"
  ).length;

  // PATIENT INITIAL
  const patientInitial =
    patientName?.charAt(0)?.toUpperCase() || "P";

  return (
    <div className="patient-dashboard-page">
      {/* SIDEBAR */}
      <aside className="patient-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <span>✚</span>
          </div>

          <div>
            <h2>SecureDoctor</h2>
            <p>Patient Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-item active"
            type="button"
          >
            <span className="nav-icon">▦</span>
            Dashboard
          </button>

          <button
            className="sidebar-item"
            type="button"
            onClick={onBookAppointment}
          >
            <span className="nav-icon">+</span>
            Book Appointment
          </button>

          <button
            className="sidebar-item"
            type="button"
            onClick={onViewConsultations}
          >
            <span className="nav-icon">📋</span>
            My Consultations
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <div className="security-icon">🛡</div>

            <div>
              <strong>Your data is secure</strong>
              <p>Protected healthcare access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="patient-main">
        {/* HEADER */}
        <header className="patient-header">
          <div className="header-welcome">
            <p>PATIENT DASHBOARD</p>
            <h1>Welcome back, {patientName || "Patient"}!</h1>
          </div>

          <div className="header-actions">
            <button
              className="notification-button"
              type="button"
              aria-label="Notifications"
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            {/* PROFILE */}
            <div className="profile-wrapper">
              <button
                className="patient-profile-button"
                type="button"
                aria-expanded={showProfileMenu}
                onClick={() =>
                  setShowProfileMenu((previous) => !previous)
                }
              >
                <div className="patient-avatar">
                  {patientInitial}
                </div>

                <div className="patient-profile-text">
                  <strong>{patientName || "Patient"}</strong>
                  <span>Patient</span>
                </div>

                <span className="profile-arrow">▾</span>
              </button>

              {/* PROFILE DROPDOWN */}
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="dropdown-user">
                    <div className="dropdown-avatar">
                      {patientInitial}
                    </div>

                    <div>
                      <strong>{patientName || "Patient"}</strong>
                      <span>Patient Account</span>
                    </div>
                  </div>

                  <div className="dropdown-line"></div>

                  <button type="button">
                    👤 My Profile
                  </button>

                  <button type="button">
                    ⚙ Settings
                  </button>

                  <button
                    className="logout-item"
                    type="button"
                    onClick={onLogout}
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="patient-content">
          {/* HERO SECTION */}
          <section className="patient-hero">
            <div className="hero-text">
              <span className="hero-label">
                YOUR HEALTHCARE JOURNEY
              </span>

              <h2>
                Manage your appointments
                <br />
                with confidence.
              </h2>

              <p>
                View your upcoming consultations, track appointment
                status and book appointments with your doctors.
              </p>
            </div>

            <div className="hero-visual">
              <div className="hero-circle circle-one"></div>
              <div className="hero-circle circle-two"></div>

              <div className="medical-symbol">✚</div>

              <div className="hero-card-mini">
                <span className="mini-icon">✓</span>

                <div>
                  <strong>Secure Care</strong>
                  <small>Your health matters</small>
                </div>
              </div>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="patient-stats-grid">
            <div className="patient-stat-card">
              <div className="stat-icon-container total">📅</div>

              <div>
                <span>Total Appointments</span>
                <h2>{totalAppointments}</h2>
                <p>All appointments</p>
              </div>
            </div>

            <div className="patient-stat-card">
              <div className="stat-icon-container confirmed">✓</div>

              <div>
                <span>Confirmed</span>
                <h2>{confirmedAppointments}</h2>
                <p>Ready for consultation</p>
              </div>
            </div>

            <div className="patient-stat-card">
              <div className="stat-icon-container booked">◷</div>

              <div>
                <span>Booked</span>
                <h2>{bookedAppointments}</h2>
                <p>Waiting for confirmation</p>
              </div>
            </div>

            <div className="patient-stat-card">
              <div className="stat-icon-container cancelled">×</div>

              <div>
                <span>Cancelled</span>
                <h2>{cancelledAppointments}</h2>
                <p>Cancelled appointments</p>
              </div>
            </div>
          </section>

          {/* APPOINTMENTS */}
          <section className="appointments-dashboard-section">
            <div className="appointments-section-header">
              <div>
                <span className="section-label">
                  APPOINTMENT CENTER
                </span>

                <h2>My Appointments</h2>

                <p>
                  Keep track of your healthcare appointments in one
                  place.
                </p>
              </div>

              <button
                className="outline-book-button"
                type="button"
                onClick={onBookAppointment}
              >
                + Book Appointment
              </button>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="dashboard-empty-state">
                <div className="loading-animation">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <h3>Loading appointments</h3>

                <p>
                  Please wait while we securely retrieve your
                  information.
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="dashboard-empty-state">
                <h3>Unable to load appointments</h3>
                <p>{error}</p>

                <button
                  className="primary-appointment-button"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* NO APPOINTMENTS */}
            {!loading && !error && appointments.length === 0 && (
              <div className="dashboard-empty-state">
                <div className="empty-calendar-icon">📅</div>

                <h3>No appointments yet</h3>

                <p>
                  You haven't booked any appointments. Start your
                  healthcare journey by booking your first
                  consultation.
                </p>

                <button
                  className="primary-appointment-button"
                  type="button"
                  onClick={onBookAppointment}
                >
                  + Book Your First Appointment
                </button>
              </div>
            )}

            {/* APPOINTMENT LIST */}
            {!loading && !error && appointments.length > 0 && (
              <div className="patient-appointment-list">
                {appointments.map((appointment, index) => {
                  const appointmentId =
                    appointment.appointmentId ??
                    appointment.appointment_id ??
                    appointment.id ??
                    index;

                  const doctorName =
                    appointment.doctorName ??
                    appointment.doctor_name ??
                    appointment.doctor?.fullName ??
                    appointment.doctor?.full_name ??
                    "Doctor";

                  const appointmentDate =
                    appointment.appointmentDate ??
                    appointment.appointment_date;

                  const appointmentTime =
                    appointment.appointmentTime ??
                    appointment.appointment_time;

                  const status = appointment.status || "Booked";

                  return (
                    <div
                      className="modern-appointment-card"
                      key={appointmentId}
                    >
                      {/* DOCTOR */}
                      <div className="appointment-doctor">
                        <div className="doctor-avatar-modern">
                          👨‍⚕️
                        </div>

                        <div className="doctor-details-modern">
                          <span>YOUR DOCTOR</span>
                          <h3>{doctorName}</h3>
                          <p>Medical Consultation</p>
                        </div>
                      </div>

                      {/* DATE */}
                      <div className="appointment-info-modern">
                        <span className="appointment-info-label">
                          DATE
                        </span>

                        <strong>
                          📅 {formatDate(appointmentDate)}
                        </strong>
                      </div>

                      {/* TIME */}
                      <div className="appointment-info-modern">
                        <span className="appointment-info-label">
                          TIME
                        </span>

                        <strong>
                          🕐 {formatTime(appointmentTime)}
                        </strong>
                      </div>

                      {/* STATUS */}
                      <div className="appointment-status-area">
                        <span className="appointment-info-label">
                          STATUS
                        </span>

                        <span className={getStatusClass(status)}>
                          <span className="status-dot"></span>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default MyAppointments;