import { useEffect, useState } from "react";
import "./DoctorDashboard.css";

function DoctorDashboard({ doctorId, doctorName }) {

  const [appointments, setAppointments] = useState([]);
  const [patientNames, setPatientNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // =========================
  // AVAILABILITY STATES
  // =========================

  const [availability, setAvailability] = useState([]);
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityTime, setAvailabilityTime] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(false);


  // =========================
  // LOAD DOCTOR APPOINTMENTS
  // =========================

  const loadAppointments = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/appointments/doctor/${doctorId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load appointments");
      }

      const data = await response.json();

      setAppointments(data);


      // =========================
      // LOAD PATIENT NAMES
      // =========================

      const uniquePatientIds = [
        ...new Set(
          data
            .map((appointment) => appointment.patientId)
            .filter(Boolean)
        ),
      ];

      const patientData = {};

      await Promise.all(

        uniquePatientIds.map(async (patientId) => {

          try {

            const patientResponse = await fetch(
              `http://localhost:8080/users/${patientId}`
            );

            if (patientResponse.ok) {

              const patient =
                await patientResponse.json();

              patientData[patientId] =
                patient.fullName || "Patient";
            }

          } catch (error) {

            console.error(
              "Unable to load patient:",
              patientId,
              error
            );
          }

        })

      );

      setPatientNames(patientData);

    } catch (error) {

      console.error(
        "Error loading appointments:",
        error
      );

      alert("Unable to load appointments.");

    } finally {

      setLoading(false);
    }
  };


  // =========================
  // LOAD DOCTOR AVAILABILITY
  // =========================

  const loadAvailability = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/availability/doctor/${doctorId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load availability");
      }

      const data = await response.json();

      setAvailability(data);

    } catch (error) {

      console.error(
        "Error loading availability:",
        error
      );
    }
  };


  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    if (doctorId) {

      loadAppointments();
      loadAvailability();

    }

  }, [doctorId]);


  // =========================
  // ADD AVAILABILITY SLOT
  // =========================

  const addAvailabilitySlot = async (e) => {

    e.preventDefault();

    if (!availabilityDate || !availabilityTime) {

      alert("Please select date and time.");

      return;
    }

    try {

      setAvailabilityLoading(true);

      const response = await fetch(
        "http://localhost:8080/availability",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            doctorId: doctorId,
            availableDate: availabilityDate,
            availableTime: availabilityTime,
          }),
        }
      );

      if (response.ok) {

        const newSlot =
          await response.json();

        setAvailability((previousSlots) => [
          ...previousSlots,
          newSlot,
        ]);

        setAvailabilityDate("");
        setAvailabilityTime("");

        alert(
          "Availability slot added successfully!"
        );

      } else {

        const errorText =
          await response.text();

        alert(
          errorText ||
          "Unable to add availability slot."
        );
      }

    } catch (error) {

      console.error(
        "Availability error:",
        error
      );

      alert("Backend connection failed!");

    } finally {

      setAvailabilityLoading(false);
    }
  };


  // =========================
  // DELETE AVAILABILITY SLOT
  // =========================

  const deleteAvailabilitySlot = async (id) => {

    const confirmDelete =
      window.confirm(
        "Do you want to remove this availability slot?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/availability/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {

        setAvailability((previousSlots) =>
          previousSlots.filter(
            (slot) =>
              slot.availabilityId !== id
          )
        );

        alert(
          "Availability slot removed successfully!"
        );

      } else {

        const errorText =
          await response.text();

        alert(
          errorText ||
          "Unable to delete availability slot."
        );
      }

    } catch (error) {

      console.error(
        "Delete availability error:",
        error
      );

      alert("Backend connection failed!");
    }
  };


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

        alert(
          errorText ||
          "Unable to update appointment."
        );
      }

    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      alert(
        "Backend connection failed!"
      );
    }
  };


  // =========================
  // DASHBOARD COUNTS
  // =========================

  const totalAppointments =
    appointments.length;

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

  const activeSlots =
    availability.filter(
      (slot) =>
        slot.isAvailable === true
    ).length;


  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {

    if (status === "Confirmed") {
      return "doctor-status doctor-confirmed";
    }

    if (status === "Cancelled") {
      return "doctor-status doctor-cancelled";
    }

    return "doctor-status doctor-booked";
  };


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

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
  };


  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (time) => {

    if (!time) {
      return "";
    }

    const [hours, minutes] =
      time.split(":");

    const hour =
      Number(hours);

    const amPm =
      hour >= 12
        ? "PM"
        : "AM";

    const formattedHour =
      hour % 12 || 12;

    return `${formattedHour}:${minutes} ${amPm}`;
  };


  return (

    <div className="doctor-dashboard-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="doctor-sidebar">

        <div className="doctor-sidebar-brand">

          <div className="doctor-brand-icon">
            ✚
          </div>

          <div>

            <h1>
              SecureDoctor
            </h1>

            <p>
              Doctor Portal
            </p>

          </div>

        </div>


        <div className="doctor-nav-section">

          <p className="doctor-nav-title">
            MAIN MENU
          </p>


          <button className="doctor-nav-item active">

            <span className="doctor-nav-icon">
              ▦
            </span>

            Dashboard

          </button>


          <button className="doctor-nav-item">

            <span className="doctor-nav-icon">
              ▣
            </span>

            Appointments

            {bookedAppointments > 0 && (

              <span className="doctor-nav-badge">
                {bookedAppointments}
              </span>

            )}

          </button>


          <button className="doctor-nav-item">

            <span className="doctor-nav-icon">
              ♙
            </span>

            Patients

          </button>


          <button className="doctor-nav-item">

            <span className="doctor-nav-icon">
              ◷
            </span>

            Availability

          </button>

        </div>


        <div className="doctor-sidebar-footer">

          <div className="doctor-security-box">

            <div className="doctor-security-icon">
              🔒
            </div>

            <div>

              <strong>
                Secure Platform
              </strong>

              <p>
                Your data is protected
              </p>

            </div>

          </div>

        </div>

      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <div className="doctor-main-area">


        {/* =========================
            TOP HEADER
        ========================= */}

        <header className="doctor-topbar">

          <div>

            <p className="doctor-page-label">
              SECUREDOCTOR PORTAL
            </p>

            <h2>
              Doctor Dashboard
            </h2>

          </div>


          <div className="doctor-top-actions">

            <button className="doctor-notification">

              🔔

              {bookedAppointments > 0 && (
                <span className="doctor-notification-dot"></span>
              )}

            </button>


            <div className="doctor-profile-wrapper">

              <button
                className="doctor-profile-button"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >

                <div className="doctor-avatar">

                  {doctorName
                    ? doctorName
                        .charAt(0)
                        .toUpperCase()
                    : "D"}

                </div>


                <div className="doctor-profile-info">

                  <strong>
                    {doctorName || "Doctor"}
                  </strong>

                  <span>
                    Medical Professional
                  </span>

                </div>

                <span className="doctor-arrow">
                  ▾
                </span>

              </button>


              {profileOpen && (

                <div className="doctor-profile-menu">

                  <div className="doctor-profile-menu-header">

                    <div className="doctor-avatar large">

                      {doctorName
                        ? doctorName
                            .charAt(0)
                            .toUpperCase()
                        : "D"}

                    </div>


                    <div>

                      <strong>
                        {doctorName || "Doctor"}
                      </strong>

                      <p>
                        Doctor Account
                      </p>

                    </div>

                  </div>


                  <div className="doctor-menu-divider"></div>


                  <button>
                    👤 My Profile
                  </button>

                  <button>
                    ⚙ Settings
                  </button>

                  <button
                    className="doctor-logout-button"
                    onClick={() =>
                      window.location.reload()
                    }
                  >
                    ↪ Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* =========================
            DASHBOARD CONTENT
        ========================= */}

        <main className="doctor-dashboard-content">


          {/* =========================
              WELCOME
          ========================= */}

          <section className="doctor-welcome-section">

            <div>

              <p className="doctor-welcome-small">
                GOOD TO SEE YOU
              </p>

              <h1>
                Welcome back, Dr.{" "}
                {doctorName || "Doctor"} 👋
              </h1>

              <p className="doctor-welcome-text">
                Manage appointments, patients and
                consultation availability securely
                from one place.
              </p>

            </div>


            <div className="doctor-welcome-summary">

              <div className="doctor-summary-icon">
                📅
              </div>

              <div>

                <span>
                  Pending Requests
                </span>

                <strong>
                  {bookedAppointments}
                </strong>

              </div>

            </div>

          </section>


          {/* =========================
              STATISTICS
          ========================= */}

          <section className="doctor-stats-grid">


            <div className="doctor-stat-card">

              <div className="doctor-stat-icon total">
                📅
              </div>

              <div>

                <p>
                  Total Appointments
                </p>

                <h3>
                  {totalAppointments}
                </h3>

                <span>
                  All patient bookings
                </span>

              </div>

            </div>


            <div className="doctor-stat-card">

              <div className="doctor-stat-icon pending">
                ⏳
              </div>

              <div>

                <p>
                  Awaiting Response
                </p>

                <h3>
                  {bookedAppointments}
                </h3>

                <span>
                  Requires your action
                </span>

              </div>

            </div>


            <div className="doctor-stat-card">

              <div className="doctor-stat-icon confirmed">
                ✓
              </div>

              <div>

                <p>
                  Confirmed
                </p>

                <h3>
                  {confirmedAppointments}
                </h3>

                <span>
                  Approved appointments
                </span>

              </div>

            </div>


            <div className="doctor-stat-card">

              <div className="doctor-stat-icon available">
                ◷
              </div>

              <div>

                <p>
                  Active Slots
                </p>

                <h3>
                  {activeSlots}
                </h3>

                <span>
                  Available for booking
                </span>

              </div>

            </div>

          </section>


          {/* =========================
              AVAILABILITY MANAGEMENT
          ========================= */}

          <section className="doctor-availability-section">

            <div className="doctor-section-header">

              <div>

                <p className="doctor-section-label">
                  AVAILABILITY MANAGEMENT
                </p>

                <h2>
                  Manage Your Availability
                </h2>

                <p>
                  Set consultation slots that
                  patients can book.
                </p>

              </div>


              <div className="availability-total">

                <span>
                  Active Slots
                </span>

                <strong>
                  {activeSlots}
                </strong>

              </div>

            </div>


            {/* ADD SLOT */}

            <div className="availability-add-card">

              <div className="availability-card-heading">

                <div className="availability-heading-icon">
                  📅
                </div>

                <div>

                  <h3>
                    Add New Availability
                  </h3>

                  <p>
                    Choose a date and time for
                    your next consultation slot.
                  </p>

                </div>

              </div>


              <form
                className="availability-form"
                onSubmit={addAvailabilitySlot}
              >

                <div className="availability-input-group">

                  <label>
                    Available Date
                  </label>

                  <input
                    type="date"
                    value={availabilityDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setAvailabilityDate(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="availability-input-group">

                  <label>
                    Available Time
                  </label>

                  <input
                    type="time"
                    value={availabilityTime}
                    onChange={(e) =>
                      setAvailabilityTime(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <button
                  type="submit"
                  className="availability-add-button"
                  disabled={availabilityLoading}
                >

                  {availabilityLoading
                    ? "Adding..."
                    : "+ Add Slot"}

                </button>

              </form>

            </div>


            {/* AVAILABILITY LIST */}

            <div className="availability-slots-container">


              {availability.length === 0 && (

                <div className="availability-empty-state">

                  <div>
                    📆
                  </div>

                  <h3>
                    No availability slots yet
                  </h3>

                  <p>
                    Add your first available
                    consultation time above.
                  </p>

                </div>

              )}


              {availability.length > 0 && (

                <div className="availability-slots-grid">

                  {availability.map((slot) => (

                    <div
                      className="availability-slot-card"
                      key={slot.availabilityId}
                    >

                      <div className="slot-date-icon">
                        📅
                      </div>


                      <div className="slot-details">

                        <span>
                          CONSULTATION SLOT
                        </span>

                        <h3>
                          {formatDate(
                            slot.availableDate
                          )}
                        </h3>

                        <p>
                          🕐{" "}
                          {formatTime(
                            slot.availableTime
                          )}
                        </p>

                      </div>


                      <div className="slot-actions">

                        <span
                          className={
                            slot.isAvailable
                              ? "slot-status active"
                              : "slot-status booked"
                          }
                        >

                          {slot.isAvailable
                            ? "Available"
                            : "Booked"}

                        </span>


                        {slot.isAvailable && (

                          <button
                            className="slot-delete-button"
                            onClick={() =>
                              deleteAvailabilitySlot(
                                slot.availabilityId
                              )
                            }
                            title="Delete slot"
                          >
                            🗑
                          </button>

                        )}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>


          {/* =========================
              APPOINTMENTS SECTION
          ========================= */}

          <section className="doctor-appointments-section">

            <div className="doctor-section-header">

              <div>

                <p className="doctor-section-label">
                  APPOINTMENT MANAGEMENT
                </p>

                <h2>
                  Patient Appointments
                </h2>

                <p>
                  Review and manage your upcoming
                  patient appointments.
                </p>

              </div>


              <button
                className="doctor-refresh-button"
                onClick={() => {
                  loadAppointments();
                  loadAvailability();
                }}
              >
                ↻ Refresh
              </button>

            </div>


            {/* LOADING */}

            {loading && (

              <div className="doctor-loading">

                <div className="doctor-spinner"></div>

                <p>
                  Loading appointments...
                </p>

              </div>

            )}


            {/* EMPTY STATE */}

            {!loading &&
              appointments.length === 0 && (

                <div className="doctor-empty-state">

                  <div className="doctor-empty-icon">
                    📅
                  </div>

                  <h3>
                    No appointments yet
                  </h3>

                  <p>
                    New patient appointment requests
                    will appear here.
                  </p>

                </div>

              )}


            {/* APPOINTMENT CARDS */}

            {!loading &&
              appointments.length > 0 && (

                <div className="doctor-appointment-list">

                  {appointments.map(
                    (appointment) => (

                      <div
                        className="doctor-appointment-card"
                        key={
                          appointment.appointmentId
                        }
                      >


                        {/* PATIENT */}

                        <div className="doctor-patient-column">

                          <div className="doctor-patient-avatar">

                            {(
                              patientNames[
                                appointment.patientId
                              ] || "P"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>


                          <div>

                            <h3>

                              {
                                patientNames[
                                  appointment.patientId
                                ] || "Patient"
                              }

                            </h3>

                            <p>
                              Patient Appointment
                            </p>

                          </div>

                        </div>


                        {/* DATE */}

                        <div className="doctor-appointment-detail">

                          <span>
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

                        <div className="doctor-appointment-detail">

                          <span>
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

                        <div className="doctor-appointment-detail">

                          <span>
                            STATUS
                          </span>

                          <div>

                            <span
                              className={getStatusClass(
                                appointment.status
                              )}
                            >
                              {appointment.status}
                            </span>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="doctor-card-actions">

                          {appointment.status ===
                            "Booked" && (

                            <>

                              <button
                                className="doctor-confirm-button"
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.appointmentId,
                                    "Confirmed"
                                  )
                                }
                              >
                                ✓ Confirm
                              </button>


                              <button
                                className="doctor-cancel-button"
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.appointmentId,
                                    "Cancelled"
                                  )
                                }
                              >
                                Cancel
                              </button>

                            </>

                          )}


                          {appointment.status ===
                            "Confirmed" && (

                            <button
                              className="doctor-confirmed-button"
                              disabled
                            >
                              ✓ Confirmed
                            </button>

                          )}


                          {appointment.status ===
                            "Cancelled" && (

                            <button
                              className="doctor-cancelled-button"
                              disabled
                            >
                              Cancelled
                            </button>

                          )}

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

export default DoctorDashboard;