import { useEffect, useState } from "react";
import API_BASE_URL from "./api";
import "./AvailableSlots.css";

function AvailableSlots({
  patientId,
  onBack,
  onBookingSuccess,
}) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Helper functions: support camelCase and snake_case
  const getDoctorId = (doctor) =>
    doctor?.userId ??
    doctor?.user_id ??
    doctor?.id;

  const getDoctorName = (doctor) =>
    doctor?.fullName ??
    doctor?.full_name ??
    doctor?.name ??
    "Doctor";

  const getSlotDate = (slot) =>
    slot?.availableDate ??
    slot?.available_date ??
    "";

  const getSlotTime = (slot) =>
    slot?.availableTime ??
    slot?.available_time ??
    "";

  const getSlotId = (slot) =>
    slot?.availabilityId ??
    slot?.availability_id ??
    slot?.id;

  const isSlotAvailable = (slot) =>
    slot?.isAvailable === true ||
    slot?.is_available === true;

  // LOAD DOCTORS
  useEffect(() => {
    const controller = new AbortController();

    const fetchDoctors = async () => {
      setLoadingDoctors(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/doctors`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load doctors.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid doctors response.");
        }

        setDoctors(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Doctor loading error:", error);
          alert(error.message || "Unable to load doctors.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDoctors(false);
        }
      }
    };

    fetchDoctors();

    return () => controller.abort();
  }, []);

  // LOAD DOCTOR AVAILABILITY
  const loadDoctorSlots = async (doctor) => {
    const doctorId = getDoctorId(doctor);

    if (doctorId == null) {
      alert("Doctor ID is missing.");
      return;
    }

    setSelectedDoctor(doctor);
    setSlots([]);
    setSelectedDate("");
    setSelectedTime("");
    setLoadingSlots(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/availability/doctor/${doctorId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load available slots.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid availability response.");
      }

      setSlots(data);
    } catch (error) {
      console.error("Slot loading error:", error);
      alert(error.message || "Unable to load available slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // UNIQUE AVAILABLE DATES
  const availableDates = [
    ...new Set(
      slots
        .filter(isSlotAvailable)
        .map(getSlotDate)
        .filter(Boolean)
    ),
  ].sort();

  // FILTER AVAILABLE TIMES FOR SELECTED DATE
  const availableTimes = slots.filter(
    (slot) =>
      getSlotDate(slot) === selectedDate &&
      isSlotAvailable(slot)
  );

  // BOOK APPOINTMENT
  const bookAppointment = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (!selectedTime) {
      alert("Please select a time slot.");
      return;
    }

    if (patientId == null || patientId === "") {
      alert("Patient information not found. Please login again.");
      return;
    }

    const doctorId = getDoctorId(selectedDoctor);

    if (doctorId == null) {
      alert("Doctor ID is missing.");
      return;
    }

    setBookingLoading(true);

    try {
      const appointmentData = {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        appointmentDate: selectedDate,
        appointmentTime:
          selectedTime.length === 5
            ? `${selectedTime}:00`
            : selectedTime,
        status: "Booked",
      };

      console.log("Booking appointment:", appointmentData);

      const response = await fetch(
        `${API_BASE_URL}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Booking failed:", responseText);

        throw new Error(
          responseText || "Unable to book appointment."
        );
      }

      let data = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          // Some APIs return plain text after a successful POST.
          data = {};
        }
      }

      console.log("Appointment created:", data);

      alert("Appointment booked successfully!");

      setSelectedDoctor(null);
      setSlots([]);
      setSelectedDate("");
      setSelectedTime("");

      if (onBookingSuccess) {
        onBookingSuccess(data);
      }
    } catch (error) {
      console.error("Booking error:", error);

      alert(
        error.message || "Unable to connect to backend."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="available-slots-page">
      {/* HEADER */}
      <header className="slots-header">
        <div className="slots-brand">
          <div className="slots-logo">✚</div>

          <div>
            <h2>SecureDoctor</h2>
            <span>Patient Portal</span>
          </div>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="slots-container">
        {/* HERO */}
        <section className="slots-hero">
          <div>
            <span className="hero-label">
              APPOINTMENT BOOKING
            </span>

            <h1>
              Find the right time
              for your care.
            </h1>

            <p>
              Select your doctor, choose an available date
              and book your appointment.
            </p>
          </div>

          <div className="hero-security">
            <div className="security-icon">🔒</div>

            <div>
              <strong>Secure Booking</strong>

              <span>
                Your healthcare data is protected.
              </span>
            </div>
          </div>
        </section>

        {/* STEP 1: DOCTOR */}
        <section className="booking-section">
          <div className="step-heading">
            <span>01</span>

            <div>
              <h2>Choose your doctor</h2>
              <p>Select a healthcare professional.</p>
            </div>
          </div>

          {loadingDoctors && (
            <div className="loading-box">
              Loading doctors...
            </div>
          )}

          {!loadingDoctors && doctors.length === 0 && (
            <div className="no-slots">
              No doctors found.
            </div>
          )}

          {!loadingDoctors && doctors.length > 0 && (
            <div className="doctor-grid">
              {doctors.map((doctor) => {
                const doctorId = getDoctorId(doctor);
                const doctorName = getDoctorName(doctor);

                const isSelected =
                  String(getDoctorId(selectedDoctor)) ===
                  String(doctorId);

                return (
                  <button
                    type="button"
                    key={doctorId}
                    className={`doctor-card ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => loadDoctorSlots(doctor)}
                    disabled={loadingSlots || bookingLoading}
                  >
                    <div className="doctor-avatar">
                      {doctorName.charAt(0).toUpperCase()}
                    </div>

                    <div className="doctor-details">
                      <h3>Dr. {doctorName}</h3>
                      <p>Medical Professional</p>
                    </div>

                    <span className="select-indicator">
                      {isSelected ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* STEP 2: DATE */}
        {selectedDoctor && (
          <section className="booking-section">
            <div className="step-heading">
              <span>02</span>

              <div>
                <h2>Select a date</h2>
                <p>
                  Choose from the doctor's available dates.
                </p>
              </div>
            </div>

            {loadingSlots && (
              <div className="loading-box">
                Loading available dates...
              </div>
            )}

            {!loadingSlots && availableDates.length === 0 && (
              <div className="no-slots">
                No available slots for this doctor.
              </div>
            )}

            {!loadingSlots && availableDates.length > 0 && (
              <div className="date-grid">
                {availableDates.map((date) => (
                  <button
                    type="button"
                    key={date}
                    className={`date-card ${
                      selectedDate === date ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime("");
                    }}
                  >
                    📅
                    <span>{date}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* STEP 3: TIME */}
        {selectedDate && !loadingSlots && (
          <section className="booking-section">
            <div className="step-heading">
              <span>03</span>

              <div>
                <h2>Select a time</h2>
                <p>
                  Available time slots for {selectedDate}.
                </p>
              </div>
            </div>

            {availableTimes.length === 0 && (
              <div className="no-slots">
                No available time slots for this date.
              </div>
            )}

            {availableTimes.length > 0 && (
              <div className="time-grid">
                {availableTimes.map((slot, index) => {
                  const slotTime = getSlotTime(slot);
                  const slotId = getSlotId(slot);

                  return (
                    <button
                      type="button"
                      key={slotId ?? `${slotTime}-${index}`}
                      className={`time-slot ${
                        selectedTime === slotTime ? "selected" : ""
                      }`}
                      onClick={() => setSelectedTime(slotTime)}
                    >
                      🕐 {slotTime}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* BOOKING SUMMARY */}
        {selectedDoctor &&
          selectedDate &&
          selectedTime && (
            <section className="booking-summary">
              <div>
                <span>APPOINTMENT SUMMARY</span>

                <h2>
                  Dr. {getDoctorName(selectedDoctor)}
                </h2>

                <p>
                  📅 {selectedDate}
                  &nbsp;&nbsp; • &nbsp;&nbsp;
                  🕐 {selectedTime}
                </p>
              </div>

              <button
                type="button"
                className="confirm-booking-button"
                onClick={bookAppointment}
                disabled={bookingLoading}
              >
                {bookingLoading
                  ? "Booking..."
                  : "Confirm Appointment →"}
              </button>
            </section>
          )}
      </main>
    </div>
  );
}

export default AvailableSlots;