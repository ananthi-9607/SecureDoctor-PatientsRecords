import { useEffect, useState } from "react";
import "./MyAppointments.css";

function MyAppointments({
  patientId,
  patientName,
  onBookAppointment,
  onViewConsultations,
}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  // =========================
  // LOAD PATIENT APPOINTMENTS
  // =========================

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8080/appointments/patient/${patientId}`
        );

        if (response.ok) {
          const data = await response.json();

          console.log(
            "Patient appointments:",
            data
          );

          setAppointments(
            Array.isArray(data) ? data : []
          );
        } else {
          console.error(
            "Failed to load appointments"
          );

          setAppointments([]);
        }
      } catch (error) {
        console.error(
          "Backend connection error:",
          error
        );

        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    const normalizedStatus =
      status?.toLowerCase() || "";

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

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    try {
      return new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (time) => {
    if (!time) {
      return "Not available";
    }

    try {
      const [hours, minutes] =
        time.split(":");

      const date = new Date();

      date.setHours(hours);
      date.setMinutes(minutes);

      return date.toLocaleTimeString(
        "en-IN",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      );
    } catch {
      return time;
    }
  };

  // =========================
  // DASHBOARD COUNTS
  // =========================

  const totalAppointments =
    appointments.length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status?.toLowerCase() ===
        "confirmed"
    ).length;

  const bookedAppointments =
    appointments.filter(
      (appointment) => {
        const status =
          appointment.status?.toLowerCase();

        return (
          status === "booked" ||
          status === "pending"
        );
      }
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status?.toLowerCase() ===
        "cancelled"
    ).length;

  // =========================
  // PATIENT INITIAL
  // =========================

  const patientInitial =
    patientName?.charAt(0)?.toUpperCase() ||
    "P";

  return (
    <div className="patient-dashboard-page">

      {/* =========================
          SIDEBAR
      ========================= */}

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

          {/* DASHBOARD */}

          <button className="sidebar-item active">

            <span className="nav-icon">
              ▦
            </span>

            Dashboard

          </button>


          {/* BOOK APPOINTMENT */}

          <button
            className="sidebar-item"
            onClick={onBookAppointment}
          >

            <span className="nav-icon">
              +
            </span>

            Book Appointment

          </button>


          {/* MY CONSULTATIONS */}

          <button
            className="sidebar-item"
            onClick={onViewConsultations}
          >

            <span className="nav-icon">
              📋
            </span>

            My Consultations

          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="security-card">

            <div className="security-icon">
              🛡
            </div>

            <div>

              <strong>
                Your data is secure
              </strong>

              <p>
                Protected healthcare access
              </p>

            </div>

          </div>

        </div>

      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <div className="patient-main">

        {/* HEADER */}

        <header className="patient-header">

          <div className="header-welcome">

            <p>
              PATIENT DASHBOARD
            </p>

            <h1>
              Welcome back, {patientName}!
            </h1>

          </div>


          <div className="header-actions">

            <button className="notification-button">
              🔔

              <span className="notification-dot"></span>
            </button>


            <div className="profile-wrapper">

              <button
                className="patient-profile-button"
                onClick={() =>
                  setShowProfileMenu(
                    !showProfileMenu
                  )
                }
              >

                <div className="patient-avatar">
                  {patientInitial}
                </div>

                <div className="patient-profile-text">

                  <strong>
                    {patientName || "Patient"}
                  </strong>

                  <span>
                    Patient
                  </span>

                </div>

                <span className="profile-arrow">
                  ▾
                </span>

              </button>


              {showProfileMenu && (

                <div className="profile-dropdown">

                  <div className="dropdown-user">

                    <div className="dropdown-avatar">
                      {patientInitial}
                    </div>

                    <div>

                      <strong>
                        {patientName || "Patient"}
                      </strong>

                      <span>
                        Patient Account
                      </span>

                    </div>

                  </div>


                  <div className="dropdown-line"></div>


                  <button>
                    👤 My Profile
                  </button>

                  <button>
                    ⚙ Settings
                  </button>

                  <button className="logout-item">
                    ↪ Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* =========================
            CONTENT
        ========================= */}

        <main className="patient-content">

          {/* =========================
              HERO SECTION
          ========================= */}

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
                View your upcoming consultations,
                track appointment status and book
                appointments with your doctors.
              </p>

            </div>


            <div className="hero-visual">

              <div className="hero-circle circle-one"></div>

              <div className="hero-circle circle-two"></div>

              <div className="medical-symbol">
                ✚
              </div>

              <div className="hero-card-mini">

                <span className="mini-icon">
                  ✓
                </span>

                <div>

                  <strong>
                    Secure Care
                  </strong>

                  <small>
                    Your health matters
                  </small>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              STATISTICS
          ========================= */}

          <section className="patient-stats-grid">

            <div className="patient-stat-card">

              <div className="stat-icon-container total">
                📅
              </div>

              <div>

                <span>
                  Total Appointments
                </span>

                <h2>
                  {totalAppointments}
                </h2>

                <p>
                  All appointments
                </p>

              </div>

            </div>


            <div className="patient-stat-card">

              <div className="stat-icon-container confirmed">
                ✓
              </div>

              <div>

                <span>
                  Confirmed
                </span>

                <h2>
                  {confirmedAppointments}
                </h2>

                <p>
                  Ready for consultation
                </p>

              </div>

            </div>


            <div className="patient-stat-card">

              <div className="stat-icon-container booked">
                ◷
              </div>

              <div>

                <span>
                  Booked
                </span>

                <h2>
                  {bookedAppointments}
                </h2>

                <p>
                  Waiting for confirmation
                </p>

              </div>

            </div>


            <div className="patient-stat-card">

              <div className="stat-icon-container cancelled">
                ×
              </div>

              <div>

                <span>
                  Cancelled
                </span>

                <h2>
                  {cancelledAppointments}
                </h2>

                <p>
                  Cancelled appointments
                </p>

              </div>

            </div>

          </section>


          {/* =========================
              APPOINTMENTS HEADER
          ========================= */}

          <section className="appointments-dashboard-section">

            <div className="appointments-section-header">

              <div>

                <span className="section-label">
                  APPOINTMENT CENTER
                </span>

                <h2>
                  My Appointments
                </h2>

                <p>
                  Keep track of your healthcare
                  appointments in one place.
                </p>

              </div>


              <button
                className="outline-book-button"
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

                <h3>
                  Loading appointments
                </h3>

                <p>
                  Please wait while we securely
                  retrieve your information.
                </p>

              </div>

            )}


            {/* NO APPOINTMENTS */}

            {!loading &&
              appointments.length === 0 && (

                <div className="dashboard-empty-state">

                  <div className="empty-calendar-icon">
                    📅
                  </div>

                  <h3>
                    No appointments yet
                  </h3>

                  <p>
                    You haven't booked any appointments.
                    Start your healthcare journey by
                    booking your first consultation.
                  </p>

                  <button
                    className="primary-appointment-button"
                    onClick={onBookAppointment}
                  >

                    + Book Your First Appointment

                  </button>

                </div>

              )}


            {/* APPOINTMENT LIST */}

            {!loading &&
              appointments.length > 0 && (

                <div className="patient-appointment-list">

                  {appointments.map(
                    (appointment, index) => (

                      <div
                        className="modern-appointment-card"
                        key={
                          appointment.appointmentId ||
                          appointment.id ||
                          index
                        }
                      >

                        {/* DOCTOR */}

                        <div className="appointment-doctor">

                          <div className="doctor-avatar-modern">
                            👨‍⚕️
                          </div>

                          <div className="doctor-details-modern">

                            <span>
                              YOUR DOCTOR
                            </span>

                            <h3>
                              {appointment.doctorName ||
                                appointment.doctor?.fullName ||
                                "Doctor"}
                            </h3>

                            <p>
                              Medical Consultation
                            </p>

                          </div>

                        </div>


                        {/* DATE */}

                        <div className="appointment-info-modern">

                          <span className="appointment-info-label">
                            DATE
                          </span>

                          <strong>
                            📅{" "}
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </strong>

                        </div>


                        {/* TIME */}

                        <div className="appointment-info-modern">

                          <span className="appointment-info-label">
                            TIME
                          </span>

                          <strong>
                            🕐{" "}
                            {formatTime(
                              appointment.appointmentTime
                            )}
                          </strong>

                        </div>


                        {/* STATUS */}

                        <div className="appointment-status-area">

                          <span className="appointment-info-label">
                            STATUS
                          </span>

                          <span
                            className={getStatusClass(
                              appointment.status
                            )}
                          >

                            <span className="status-dot"></span>

                            {appointment.status ||
                              "Booked"}

                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default MyAppointments;