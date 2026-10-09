import { useCallback, useEffect, useState } from "react";
import "./DoctorDashboard.css";
import ConsultationForm from "./ConsultationForm";
import API_BASE_URL from "./api";

function DoctorDashboard({ doctorId, doctorName, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [patientNames, setPatientNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);

  const [availability, setAvailability] = useState([]);
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityTime, setAvailabilityTime] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const getAppointmentId = (appointment) =>
    appointment.appointmentId ??
    appointment.appointment_id ??
    appointment.id;

  const getPatientId = (appointment) =>
    appointment.patientId ??
    appointment.patient_id ??
    appointment.patient?.userId ??
    appointment.patient?.user_id ??
    appointment.patient?.id;

  const getDoctorId = (appointment) =>
    appointment.doctorId ??
    appointment.doctor_id ??
    appointment.doctor?.userId ??
    appointment.doctor?.user_id ??
    appointment.doctor?.id;

  const getAppointmentDate = (appointment) =>
    appointment.appointmentDate ??
    appointment.appointment_date;

  const getAppointmentTime = (appointment) =>
    appointment.appointmentTime ??
    appointment.appointment_time;

  const getAvailabilityId = (slot) =>
    slot.availabilityId ??
    slot.availability_id ??
    slot.id;

  const getSlotDate = (slot) =>
    slot.availableDate ??
    slot.available_date;

  const getSlotTime = (slot) =>
    slot.availableTime ??
    slot.available_time;

  const getSlotAvailable = (slot) =>
    slot.isAvailable ??
    slot.is_available ??
    false;

  // LOAD APPOINTMENTS AND PATIENT NAMES
  const loadAppointments = useCallback(async () => {
    if (!doctorId) {
      setAppointments([]);
      setPatientNames({});
      setLoading(false);
      setLoadError("Doctor ID is missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(
        `${API_BASE_URL}/appointments/doctor/${doctorId}`
      );

      if (!response.ok) {
        throw new Error(`Unable to load appointments (${response.status})`);
      }

      const data = await response.json();
      const appointmentList = Array.isArray(data) ? data : [];

      console.log("Doctor appointments:", appointmentList);
      setAppointments(appointmentList);

      const uniquePatientIds = [
        ...new Set(
          appointmentList
            .map(getPatientId)
            .filter((id) => id !== undefined && id !== null)
        ),
      ];

      const patientData = {};

      await Promise.all(
        uniquePatientIds.map(async (id) => {
          try {
            const patientResponse = await fetch(
              `${API_BASE_URL}/users/${id}`
            );

            if (patientResponse.ok) {
              const patient = await patientResponse.json();

              patientData[id] =
                patient.fullName ??
                patient.full_name ??
                patient.name ??
                "Patient";
            } else {
              patientData[id] = "Patient";
            }
          } catch (error) {
            console.error(`Unable to load patient ${id}:`, error);
            patientData[id] = "Patient";
          }
        })
      );

      setPatientNames(patientData);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAppointments([]);
      setPatientNames({});
      setLoadError(
        "Unable to load appointments. Check your backend connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  // LOAD DOCTOR AVAILABILITY
  const loadAvailability = useCallback(async () => {
    if (!doctorId) {
      setAvailability([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/availability/doctor/${doctorId}`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load availability (${response.status})`
        );
      }

      const data = await response.json();

      console.log("Doctor availability:", data);
      setAvailability(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading availability:", error);
      setAvailability([]);
    }
  }, [doctorId]);

  useEffect(() => {
    loadAppointments();
    loadAvailability();
  }, [loadAppointments, loadAvailability]);

  // ADD AVAILABILITY SLOT
  const addAvailabilitySlot = async (event) => {
    event.preventDefault();

    if (!doctorId) {
      alert("Doctor ID is missing. Please log in again.");
      return;
    }

    if (!availabilityDate || !availabilityTime) {
      alert("Please select date and time.");
      return;
    }

    try {
      setAvailabilityLoading(true);

      const response = await fetch(`${API_BASE_URL}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: Number(doctorId),
          availableDate: availabilityDate,
          availableTime: availabilityTime,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to add availability slot.");
      }

      const newSlot = await response.json();

      console.log("New availability slot:", newSlot);

      await loadAvailability();

      setAvailabilityDate("");
      setAvailabilityTime("");

      alert("Availability slot added successfully!");
    } catch (error) {
      console.error("Availability error:", error);
      alert(error.message || "Backend connection failed.");
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // DELETE AVAILABILITY SLOT
  const deleteAvailabilitySlot = async (id) => {
    const confirmed = window.confirm(
      "Do you want to remove this availability slot?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/availability/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to delete availability slot.");
      }

      setAvailability((previousSlots) =>
        previousSlots.filter(
          (slot) => String(getAvailabilityId(slot)) !== String(id)
        )
      );

      alert("Availability slot removed successfully!");
    } catch (error) {
      console.error("Delete availability error:", error);
      alert(error.message || "Backend connection failed.");
    }
  };

  // UPDATE APPOINTMENT STATUS
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/${appointmentId}/status?status=${encodeURIComponent(
          newStatus
        )}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to update appointment.");
      }

      // Some APIs return an empty response after a successful update.
      const responseText = await response.text();

      if (responseText.trim()) {
        const updatedAppointment = JSON.parse(responseText);

        setAppointments((previousAppointments) =>
          previousAppointments.map((appointment) =>
            String(getAppointmentId(appointment)) === String(appointmentId)
              ? updatedAppointment
              : appointment
          )
        );
      } else {
        setAppointments((previousAppointments) =>
          previousAppointments.map((appointment) =>
            String(getAppointmentId(appointment)) === String(appointmentId)
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
      }

      alert(`Appointment ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message || "Backend connection failed.");
    }
  };

  // DASHBOARD COUNTS
  const getNormalizedStatus = (appointment) =>
    (appointment.status ?? "").toLowerCase();

  const totalAppointments = appointments.length;

  const bookedAppointments = appointments.filter((appointment) =>
    ["booked", "pending"].includes(getNormalizedStatus(appointment))
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => getNormalizedStatus(appointment) === "confirmed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => getNormalizedStatus(appointment) === "cancelled"
  ).length;

  const activeSlots = availability.filter(getSlotAvailable).length;

  // UNIQUE PATIENTS
  const uniquePatients = [
    ...new Set(
      appointments
        .map(getPatientId)
        .filter((id) => id !== undefined && id !== null)
    ),
  ];

  // STATUS CLASS
  const getStatusClass = (status) => {
    const normalizedStatus = (status ?? "").toLowerCase();

    if (normalizedStatus === "confirmed") {
      return "doctor-status doctor-confirmed";
    }

    if (normalizedStatus === "cancelled") {
      return "doctor-status doctor-cancelled";
    }

    if (normalizedStatus === "completed") {
      return "doctor-status doctor-confirmed";
    }

    return "doctor-status doctor-booked";
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // FORMAT TIME
  const formatTime = (time) => {
    if (!time) return "Not available";

    const [hours, minutes] = String(time).split(":");
    const parsedHours = Number(hours);
    const parsedMinutes = Number(minutes);

    if (
      !Number.isFinite(parsedHours) ||
      !Number.isFinite(parsedMinutes)
    ) {
      return String(time);
    }

    const date = new Date();
    date.setHours(parsedHours, parsedMinutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // CHANGE PAGE
  const changeMenu = (menu) => {
    setActiveMenu(menu);
    setProfileOpen(false);
  };

  // PAGE TITLE
  const getPageTitle = () => {
    if (activeMenu === "appointments") return "Appointments";
    if (activeMenu === "patients") return "Patients";
    if (activeMenu === "availability") return "Availability";
    return "Doctor Dashboard";
  };

  // CONSULTATION PAGE
  if (showConsultationForm && selectedAppointment) {
    return (
      <ConsultationForm
        appointment={selectedAppointment}
        onBack={() => {
          setShowConsultationForm(false);
          setSelectedAppointment(null);
        }}
        onConsultationSaved={async () => {
          setShowConsultationForm(false);
          setSelectedAppointment(null);
          await loadAppointments();
          alert("Consultation saved successfully!");
        }}
      />
    );
  }

  // REUSABLE APPOINTMENT CARD
  const renderAppointmentCard = (appointment, showActions = false) => {
    const appointmentId = getAppointmentId(appointment);
    const patientIdValue = getPatientId(appointment);
    const patientName =
      patientNames[patientIdValue] ??
      appointment.patient?.fullName ??
      appointment.patient?.full_name ??
      "Patient";

    const status = appointment.status ?? "Booked";

    return (
      <div className="doctor-appointment-card" key={appointmentId}>
        <div className="doctor-patient-column">
          <div className="doctor-patient-avatar">
            {patientName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{patientName}</h3>
            <p>Patient Appointment</p>
          </div>
        </div>

        <div className="doctor-appointment-detail">
          <span>DATE</span>
          <strong>📅 {formatDate(getAppointmentDate(appointment))}</strong>
        </div>

        <div className="doctor-appointment-detail">
          <span>TIME</span>
          <strong>🕐 {formatTime(getAppointmentTime(appointment))}</strong>
        </div>

        <div className="doctor-appointment-detail">
          <span>STATUS</span>
          <div>
            <span className={getStatusClass(status)}>{status}</span>
          </div>
        </div>

        {showActions && (
          <div className="doctor-card-actions">
            {status.toLowerCase() === "booked" && (
              <>
                <button
                  className="doctor-confirm-button"
                  type="button"
                  onClick={() =>
                    updateAppointmentStatus(appointmentId, "Confirmed")
                  }
                >
                  ✓ Confirm
                </button>

                <button
                  className="doctor-cancel-button"
                  type="button"
                  onClick={() =>
                    updateAppointmentStatus(appointmentId, "Cancelled")
                  }
                >
                  Cancel
                </button>
              </>
            )}

            {status.toLowerCase() === "confirmed" && (
              <button
                className="doctor-confirmed-button"
                type="button"
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setShowConsultationForm(true);
                }}
              >
                Start Consultation
              </button>
            )}

            {status.toLowerCase() === "cancelled" && (
              <button
                className="doctor-cancelled-button"
                type="button"
                disabled
              >
                Cancelled
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="doctor-dashboard-page">
      {/* SIDEBAR */}
      <aside className="doctor-sidebar">
        <div className="doctor-sidebar-brand">
          <div className="doctor-brand-icon">✚</div>

          <div>
            <h1>SecureDoctor</h1>
            <p>Doctor Portal</p>
          </div>
        </div>

        <div className="doctor-nav-section">
          <p className="doctor-nav-title">MAIN MENU</p>

          <button
            type="button"
            className={`doctor-nav-item ${
              activeMenu === "dashboard" ? "active" : ""
            }`}
            onClick={() => changeMenu("dashboard")}
          >
            <span className="doctor-nav-icon">▦</span>
            Dashboard
          </button>

          <button
            type="button"
            className={`doctor-nav-item ${
              activeMenu === "appointments" ? "active" : ""
            }`}
            onClick={() => changeMenu("appointments")}
          >
            <span className="doctor-nav-icon">▣</span>
            Appointments

            {bookedAppointments > 0 && (
              <span className="doctor-nav-badge">
                {bookedAppointments}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`doctor-nav-item ${
              activeMenu === "patients" ? "active" : ""
            }`}
            onClick={() => changeMenu("patients")}
          >
            <span className="doctor-nav-icon">♙</span>
            Patients
          </button>

          <button
            type="button"
            className={`doctor-nav-item ${
              activeMenu === "availability" ? "active" : ""
            }`}
            onClick={() => changeMenu("availability")}
          >
            <span className="doctor-nav-icon">◷</span>
            Availability
          </button>
        </div>

        <div className="doctor-sidebar-footer">
          <div className="doctor-security-box">
            <div className="doctor-security-icon">🔒</div>

            <div>
              <strong>Secure Platform</strong>
              <p>Your data is protected</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="doctor-main-area">
        <header className="doctor-topbar">
          <div>
            <p className="doctor-page-label">SECUREDOCTOR PORTAL</p>
            <h2>{getPageTitle()}</h2>
          </div>

          <div className="doctor-top-actions">
            <button
              className="doctor-notification"
              type="button"
              aria-label="View appointment requests"
              onClick={() => changeMenu("appointments")}
            >
              🔔
              {bookedAppointments > 0 && (
                <span className="doctor-notification-dot"></span>
              )}
            </button>

            <div className="doctor-profile-wrapper">
              <button
                className="doctor-profile-button"
                type="button"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((previous) => !previous)}
              >
                <div className="doctor-avatar">
                  {doctorName?.charAt(0)?.toUpperCase() || "D"}
                </div>

                <div className="doctor-profile-info">
                  <strong>{doctorName || "Doctor"}</strong>
                  <span>Medical Professional</span>
                </div>

                <span className="doctor-arrow">▾</span>
              </button>

              {profileOpen && (
                <div className="doctor-profile-menu">
                  <div className="doctor-profile-menu-header">
                    <div className="doctor-avatar large">
                      {doctorName?.charAt(0)?.toUpperCase() || "D"}
                    </div>

                    <div>
                      <strong>{doctorName || "Doctor"}</strong>
                      <p>Doctor Account</p>
                    </div>
                  </div>

                  <div className="doctor-menu-divider"></div>

                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                  >
                    👤 My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                  >
                    ⚙ Settings
                  </button>

                  <button
                    className="doctor-logout-button"
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);

                      if (onLogout) {
                        onLogout();
                      } else {
                        window.location.reload();
                      }
                    }}
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="doctor-dashboard-content">
          {/* DASHBOARD */}
          {activeMenu === "dashboard" && (
            <>
              <section className="doctor-welcome-section">
                <div>
                  <p className="doctor-welcome-small">GOOD TO SEE YOU</p>

                  <h1>
                    Welcome back, Dr. {doctorName || "Doctor"} 👋
                  </h1>

                  <p className="doctor-welcome-text">
                    Manage appointments, patients and consultation
                    availability securely from one place.
                  </p>
                </div>

                <div className="doctor-welcome-summary">
                  <div className="doctor-summary-icon">📅</div>

                  <div>
                    <span>Pending Requests</span>
                    <strong>{bookedAppointments}</strong>
                  </div>
                </div>
              </section>

              <section className="doctor-stats-grid">
                <div className="doctor-stat-card">
                  <div className="doctor-stat-icon total">📅</div>

                  <div>
                    <p>Total Appointments</p>
                    <h3>{totalAppointments}</h3>
                    <span>All patient bookings</span>
                  </div>
                </div>

                <div className="doctor-stat-card">
                  <div className="doctor-stat-icon pending">⏳</div>

                  <div>
                    <p>Awaiting Response</p>
                    <h3>{bookedAppointments}</h3>
                    <span>Requires your action</span>
                  </div>
                </div>

                <div className="doctor-stat-card">
                  <div className="doctor-stat-icon confirmed">✓</div>

                  <div>
                    <p>Confirmed</p>
                    <h3>{confirmedAppointments}</h3>
                    <span>Approved appointments</span>
                  </div>
                </div>

                <div className="doctor-stat-card">
                  <div className="doctor-stat-icon available">◷</div>

                  <div>
                    <p>Active Slots</p>
                    <h3>{activeSlots}</h3>
                    <span>Available for booking</span>
                  </div>
                </div>
              </section>

              <section className="doctor-appointments-section">
                <div className="doctor-section-header">
                  <div>
                    <p className="doctor-section-label">QUICK OVERVIEW</p>
                    <h2>Recent Appointments</h2>
                    <p>Your latest patient appointment requests.</p>
                  </div>

                  <button
                    className="doctor-refresh-button"
                    type="button"
                    onClick={() => changeMenu("appointments")}
                  >
                    View All →
                  </button>
                </div>

                {loading && (
                  <div className="doctor-loading">
                    <div className="doctor-spinner"></div>
                    <p>Loading appointments...</p>
                  </div>
                )}

                {!loading && loadError && (
                  <div className="doctor-empty-state">
                    <h3>Unable to load appointments</h3>
                    <p>{loadError}</p>

                    <button
                      type="button"
                      className="doctor-refresh-button"
                      onClick={loadAppointments}
                    >
                      ↻ Try Again
                    </button>
                  </div>
                )}

                {!loading &&
                  !loadError &&
                  appointments.length === 0 && (
                    <div className="doctor-empty-state">
                      <div className="doctor-empty-icon">📅</div>
                      <h3>No appointments yet</h3>
                      <p>
                        New patient appointment requests will appear here.
                      </p>
                    </div>
                  )}

                {!loading && !loadError && appointments.length > 0 && (
                  <div className="doctor-appointment-list">
                    {appointments
                      .slice(0, 3)
                      .map((appointment) =>
                        renderAppointmentCard(appointment)
                      )}
                  </div>
                )}
              </section>
            </>
          )}

          {/* APPOINTMENTS */}
          {activeMenu === "appointments" && (
            <section className="doctor-appointments-section">
              <div className="doctor-section-header">
                <div>
                  <p className="doctor-section-label">
                    APPOINTMENT MANAGEMENT
                  </p>

                  <h2>Patient Appointments</h2>

                  <p>
                    Review and manage your upcoming patient appointments.
                  </p>
                </div>

                <button
                  className="doctor-refresh-button"
                  type="button"
                  onClick={() => {
                    loadAppointments();
                    loadAvailability();
                  }}
                >
                  ↻ Refresh
                </button>
              </div>

              {loading && (
                <div className="doctor-loading">
                  <div className="doctor-spinner"></div>
                  <p>Loading appointments...</p>
                </div>
              )}

              {!loading && loadError && (
                <div className="doctor-empty-state">
                  <h3>Unable to load appointments</h3>
                  <p>{loadError}</p>

                  <button
                    type="button"
                    className="doctor-refresh-button"
                    onClick={loadAppointments}
                  >
                    ↻ Try Again
                  </button>
                </div>
              )}

              {!loading &&
                !loadError &&
                appointments.length === 0 && (
                  <div className="doctor-empty-state">
                    <div className="doctor-empty-icon">📅</div>
                    <h3>No appointments yet</h3>
                    <p>
                      New patient appointment requests will appear here.
                    </p>
                  </div>
                )}

              {!loading && !loadError && appointments.length > 0 && (
                <div className="doctor-appointment-list">
                  {appointments.map((appointment) =>
                    renderAppointmentCard(appointment, true)
                  )}
                </div>
              )}
            </section>
          )}

          {/* PATIENTS */}
          {activeMenu === "patients" && (
            <section className="doctor-appointments-section">
              <div className="doctor-section-header">
                <div>
                  <p className="doctor-section-label">
                    PATIENT MANAGEMENT
                  </p>

                  <h2>My Patients</h2>

                  <p>
                    View patients who have booked appointments with you.
                  </p>
                </div>

                <div className="availability-total">
                  <span>Total Patients</span>
                  <strong>{uniquePatients.length}</strong>
                </div>
              </div>

              {loading && (
                <div className="doctor-loading">
                  <div className="doctor-spinner"></div>
                  <p>Loading patients...</p>
                </div>
              )}

              {!loading && loadError && (
                <div className="doctor-empty-state">
                  <h3>Unable to load patients</h3>
                  <p>{loadError}</p>
                </div>
              )}

              {!loading &&
                !loadError &&
                uniquePatients.length === 0 && (
                  <div className="doctor-empty-state">
                    <div className="doctor-empty-icon">👥</div>
                    <h3>No patients yet</h3>
                    <p>
                      Patients will appear here after booking an appointment.
                    </p>
                  </div>
                )}

              {!loading && !loadError && uniquePatients.length > 0 && (
                <div className="doctor-appointment-list">
                  {uniquePatients.map((patientIdValue) => {
                    const patientAppointments = appointments.filter(
                      (appointment) =>
                        String(getPatientId(appointment)) ===
                        String(patientIdValue)
                    );

                    const latestAppointment = patientAppointments[0];
                    const name =
                      patientNames[patientIdValue] || "Patient";

                    return (
                      <div
                        className="doctor-appointment-card"
                        key={patientIdValue}
                      >
                        <div className="doctor-patient-column">
                          <div className="doctor-patient-avatar">
                            {name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <h3>{name}</h3>
                            <p>Patient ID: {patientIdValue}</p>
                          </div>
                        </div>

                        <div className="doctor-appointment-detail">
                          <span>APPOINTMENTS</span>
                          <strong>{patientAppointments.length}</strong>
                        </div>

                        <div className="doctor-appointment-detail">
                          <span>LATEST DATE</span>

                          <strong>
                            📅{" "}
                            {latestAppointment
                              ? formatDate(
                                  getAppointmentDate(latestAppointment)
                                )
                              : "-"}
                          </strong>
                        </div>

                        <div className="doctor-appointment-detail">
                          <span>STATUS</span>

                          <div>
                            {latestAppointment && (
                              <span
                                className={getStatusClass(
                                  latestAppointment.status
                                )}
                              >
                                {latestAppointment.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* AVAILABILITY */}
          {activeMenu === "availability" && (
            <section className="doctor-availability-section">
              <div className="doctor-section-header">
                <div>
                  <p className="doctor-section-label">
                    AVAILABILITY MANAGEMENT
                  </p>

                  <h2>Manage Your Availability</h2>

                  <p>
                    Set consultation slots that patients can book.
                  </p>
                </div>

                <div className="availability-total">
                  <span>Active Slots</span>
                  <strong>{activeSlots}</strong>
                </div>
              </div>

              {/* ADD SLOT */}
              <div className="availability-add-card">
                <div className="availability-card-heading">
                  <div className="availability-heading-icon">📅</div>

                  <div>
                    <h3>Add New Availability</h3>
                    <p>
                      Choose a date and time for your next consultation slot.
                    </p>
                  </div>
                </div>

                <form
                  className="availability-form"
                  onSubmit={addAvailabilitySlot}
                >
                  <div className="availability-input-group">
                    <label htmlFor="availability-date">
                      Available Date
                    </label>

                    <input
                      id="availability-date"
                      type="date"
                      value={availabilityDate}
                      min={new Date().toLocaleDateString("en-CA")}
                      onChange={(event) =>
                        setAvailabilityDate(event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="availability-input-group">
                    <label htmlFor="availability-time">
                      Available Time
                    </label>

                    <input
                      id="availability-time"
                      type="time"
                      value={availabilityTime}
                      onChange={(event) =>
                        setAvailabilityTime(event.target.value)
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="availability-add-button"
                    disabled={availabilityLoading}
                  >
                    {availabilityLoading ? "Adding..." : "+ Add Slot"}
                  </button>
                </form>
              </div>

              {/* SLOT LIST */}
              <div className="availability-slots-container">
                {availability.length === 0 && (
                  <div className="availability-empty-state">
                    <div>📆</div>
                    <h3>No availability slots yet</h3>
                    <p>
                      Add your first available consultation time above.
                    </p>
                  </div>
                )}

                {availability.length > 0 && (
                  <div className="availability-slots-grid">
                    {availability.map((slot) => {
                      const slotId = getAvailabilityId(slot);
                      const isAvailable = getSlotAvailable(slot);

                      return (
                        <div
                          className="availability-slot-card"
                          key={slotId}
                        >
                          <div className="slot-date-icon">📅</div>

                          <div className="slot-details">
                            <span>CONSULTATION SLOT</span>

                            <h3>{formatDate(getSlotDate(slot))}</h3>

                            <p>🕐 {formatTime(getSlotTime(slot))}</p>
                          </div>

                          <div className="slot-actions">
                            <span
                              className={
                                isAvailable
                                  ? "slot-status active"
                                  : "slot-status booked"
                              }
                            >
                              {isAvailable ? "Available" : "Booked"}
                            </span>

                            {isAvailable && (
                              <button
                                className="slot-delete-button"
                                type="button"
                                onClick={() =>
                                  deleteAvailabilitySlot(slotId)
                                }
                                title="Delete slot"
                                aria-label="Delete availability slot"
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;