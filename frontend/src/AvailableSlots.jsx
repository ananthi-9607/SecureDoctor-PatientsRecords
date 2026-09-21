import { useEffect, useState } from "react";
import "./AvailableSlots.css";

function AvailableSlots({
  patientId,
  onBack,
  onBookingSuccess
}) {

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [slots, setSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);


  // ==================================================
  // RAILWAY BACKEND URL
  // ==================================================

  const BACKEND_URL =
    "https://securedoctor-patientsrecords-production.up.railway.app";


  // ==================================================
  // LOAD DOCTORS
  // ==================================================

  useEffect(() => {

    const fetchDoctors = async () => {

      try {

        const response = await fetch(
          `${BACKEND_URL}/users/doctors`
        );

        if (!response.ok) {
          throw new Error("Failed to load doctors");
        }

        const data = await response.json();

        console.log("Doctors:", data);
        console.log("First Doctor:", data[0]);

        setDoctors(data);

      } catch (error) {

        console.error(
          "Doctor loading error:",
          error
        );

        alert("Unable to load doctors.");

      } finally {

        setLoadingDoctors(false);

      }

    };

    fetchDoctors();

  }, []);


  // ==================================================
  // LOAD DOCTOR AVAILABILITY
  // ==================================================

  const loadDoctorSlots = async (doctor) => {

    setSelectedDoctor(doctor);

    setSlots([]);

    setSelectedDate("");

    setSelectedTime("");

    setLoadingSlots(true);

    try {

      console.log(
        "Selected Doctor:",
        doctor
      );

      // Get doctor ID safely

      const doctorId =
        doctor.userId ??
        doctor.user_id ??
        doctor.id;

      console.log(
        "Doctor ID:",
        doctorId
      );


      const response = await fetch(
        `${BACKEND_URL}/availability/doctor/${doctorId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load slots");
      }

      const data = await response.json();

      console.log(
        "Available slots:",
        data
      );

      setSlots(data);

    } catch (error) {

      console.error(
        "Slot loading error:",
        error
      );

      alert(
        "Unable to load available slots."
      );

    } finally {

      setLoadingSlots(false);

    }

  };


  // ==================================================
  // UNIQUE AVAILABLE DATES
  // ==================================================

  const availableDates = [
    ...new Set(
      slots
        .filter(
          (slot) =>
            slot.isAvailable === true
        )
        .map(
          (slot) =>
            slot.availableDate
        )
    )
  ];


  // ==================================================
  // FILTER TIME SLOTS
  // ==================================================

  const availableTimes = slots.filter(
    (slot) =>
      slot.availableDate === selectedDate &&
      slot.isAvailable === true
  );


  // ==================================================
  // BOOK APPOINTMENT
  // ==================================================

  const bookAppointment = async () => {

    if (!selectedDoctor) {

      alert(
        "Please select a doctor."
      );

      return;
    }


    if (!selectedDate) {

      alert(
        "Please select a date."
      );

      return;
    }


    if (!selectedTime) {

      alert(
        "Please select a time slot."
      );

      return;
    }


    if (!patientId) {

      alert(
        "Patient information not found. Please login again."
      );

      return;
    }


    try {

      // Get doctor ID safely

      const doctorId =
        selectedDoctor.userId ??
        selectedDoctor.user_id ??
        selectedDoctor.id;


      const appointmentData = {

        patientId: Number(patientId),

        doctorId: Number(doctorId),

        appointmentDate: selectedDate,

        appointmentTime:
          selectedTime.length === 5
            ? selectedTime + ":00"
            : selectedTime,

        status: "Booked"

      };


      console.log(
        "Booking appointment:",
        appointmentData
      );


      const response = await fetch(
        `${BACKEND_URL}/appointments`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            appointmentData
          )

        }
      );


      // ==================================================
      // BOOKING SUCCESS
      // ==================================================

      if (response.ok) {

        const data =
          await response.json();

        console.log(
          "Appointment created:",
          data
        );

        alert(
          "Appointment booked successfully!"
        );


        // Clear selections

        setSelectedDoctor(null);

        setSlots([]);

        setSelectedDate("");

        setSelectedTime("");


        // Go back to dashboard

        if (onBookingSuccess) {

          onBookingSuccess();

        }

      } else {

        const errorText =
          await response.text();

        console.error(
          "Booking failed:",
          errorText
        );

        alert(
          errorText ||
          "Unable to book appointment."
        );

      }


    } catch (error) {

      console.error(
        "Booking error:",
        error
      );

      alert(
        "Unable to connect to backend."
      );

    }

  };


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="available-slots-page">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="slots-header">

        <div className="slots-brand">

          <div className="slots-logo">
            ✚
          </div>

          <div>

            <h2>
              SecureDoctor
            </h2>

            <span>
              Patient Portal
            </span>

          </div>

        </div>


        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </header>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="slots-container">


        {/* ==================================================
            HERO
        ================================================== */}

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
              Select your doctor,
              choose an available date
              and book your appointment.
            </p>

          </div>


          <div className="hero-security">

            <div className="security-icon">
              🔒
            </div>

            <div>

              <strong>
                Secure Booking
              </strong>

              <span>
                Your healthcare data
                is protected.
              </span>

            </div>

          </div>

        </section>


        {/* ==================================================
            STEP 1 - DOCTOR
        ================================================== */}

        <section className="booking-section">

          <div className="step-heading">

            <span>
              01
            </span>

            <div>

              <h2>
                Choose your doctor
              </h2>

              <p>
                Select a healthcare professional.
              </p>

            </div>

          </div>


          {loadingDoctors && (

            <div className="loading-box">
              Loading doctors...
            </div>

          )}


          {!loadingDoctors && (

            <div className="doctor-grid">

              {doctors.map((doctor) => {

                const doctorId =
                  doctor.userId ??
                  doctor.user_id ??
                  doctor.id;


                return (

                  <button
                    key={doctorId}

                    className={`doctor-card ${
                      (
                        selectedDoctor?.userId ??
                        selectedDoctor?.user_id ??
                        selectedDoctor?.id
                      ) === doctorId
                        ? "selected"
                        : ""
                    }`}

                    onClick={() =>
                      loadDoctorSlots(doctor)
                    }

                  >

                    <div className="doctor-avatar">

                      {doctor.fullName
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="doctor-details">

                      <h3>
                        Dr. {doctor.fullName}
                      </h3>

                      <p>
                        Medical Professional
                      </p>

                    </div>


                    <span className="select-indicator">

                      {(
                        selectedDoctor?.userId ??
                        selectedDoctor?.user_id ??
                        selectedDoctor?.id
                      ) === doctorId
                        ? "✓"
                        : "+"}

                    </span>

                  </button>

                );

              })}

            </div>

          )}

        </section>


        {/* ==================================================
            STEP 2 - DATE
        ================================================== */}

        {selectedDoctor && (

          <section className="booking-section">

            <div className="step-heading">

              <span>
                02
              </span>

              <div>

                <h2>
                  Select a date
                </h2>

                <p>
                  Choose from the doctor's
                  available dates.
                </p>

              </div>

            </div>


            {loadingSlots && (

              <div className="loading-box">
                Loading available dates...
              </div>

            )}


            {!loadingSlots &&
              availableDates.length === 0 && (

                <div className="no-slots">

                  No available slots
                  for this doctor.

                </div>

              )}


            {!loadingSlots &&
              availableDates.length > 0 && (

                <div className="date-grid">

                  {availableDates.map((date) => (

                    <button
                      key={date}

                      className={`date-card ${
                        selectedDate === date
                          ? "selected"
                          : ""
                      }`}

                      onClick={() => {

                        setSelectedDate(date);

                        setSelectedTime("");

                      }}

                    >

                      📅

                      <span>
                        {date}
                      </span>

                    </button>

                  ))}

                </div>

              )}

          </section>

        )}


        {/* ==================================================
            STEP 3 - TIME
        ================================================== */}

        {selectedDate && (

          <section className="booking-section">

            <div className="step-heading">

              <span>
                03
              </span>

              <div>

                <h2>
                  Select a time
                </h2>

                <p>
                  Available time slots
                  for {selectedDate}.
                </p>

              </div>

            </div>


            {availableTimes.length === 0 && (

              <div className="no-slots">

                No available time slots
                for this date.

              </div>

            )}


            {availableTimes.length > 0 && (

              <div className="time-grid">

                {availableTimes.map((slot) => (

                  <button
                    key={slot.availabilityId}

                    className={`time-slot ${
                      selectedTime ===
                      slot.availableTime
                        ? "selected"
                        : ""
                    }`}

                    onClick={() =>
                      setSelectedTime(
                        slot.availableTime
                      )
                    }

                  >

                    🕐 {slot.availableTime}

                  </button>

                ))}

              </div>

            )}

          </section>

        )}


        {/* ==================================================
            BOOKING SUMMARY
        ================================================== */}

        {selectedDoctor &&
          selectedDate &&
          selectedTime && (

            <section className="booking-summary">

              <div>

                <span>
                  APPOINTMENT SUMMARY
                </span>

                <h2>
                  Dr. {selectedDoctor.fullName}
                </h2>

                <p>

                  📅 {selectedDate}

                  &nbsp;&nbsp; • &nbsp;&nbsp;

                  🕐 {selectedTime}

                </p>

              </div>


              <button
                className="confirm-booking-button"
                onClick={bookAppointment}
              >

                Confirm Appointment →

              </button>

            </section>

          )}

      </main>

    </div>

  );

}

export default AvailableSlots;