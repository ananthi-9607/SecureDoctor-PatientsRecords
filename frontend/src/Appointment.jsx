import { useEffect, useState } from "react";

function Appointment({ patientId, patientName }) {

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [status, setStatus] = useState("Booked");


  // =========================
  // CHECK PATIENT INFORMATION
  // =========================

  useEffect(() => {

    console.log("Appointment patientId:", patientId);
    console.log("Appointment patientName:", patientName);

  }, [patientId, patientName]);


  // =========================
  // LOAD DOCTORS
  // =========================

  useEffect(() => {

    const fetchDoctors = async () => {

      try {

        const response = await fetch(
          "http://localhost:8080/users/doctors"
        );

        if (response.ok) {

          const data = await response.json();

          console.log("Doctors:", data);

          setDoctors(data);

        } else {

          console.error(
            "Failed to fetch doctors"
          );

          alert(
            "Unable to load doctors."
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

    fetchDoctors();

  }, []);


  // =========================
  // BOOK APPOINTMENT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // Check doctor

    if (!doctorId) {

      alert(
        "Please select a doctor."
      );

      return;
    }


    // Check patient

    if (!patientId) {

      alert(
        "Patient information not found. Please login again."
      );

      return;
    }


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

            appointmentTime:
              appointmentTime + ":00",

            status,

          }),
        }
      );


      // =========================
      // SUCCESS
      // =========================

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


        // Clear appointment fields

        setDoctorId("");

        setAppointmentDate("");

        setAppointmentTime("");

        setStatus("Booked");


      } else {


  const errorText =
    await response.text();

  console.error(
    "Appointment failed:",
    errorText
  );

  alert(
     "Appointment booking failed!"
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


  // =========================
  // UI
  // =========================

  return (

    <div className="appointment-page">

      <div className="appointment-card">

        <h2>
          Book Appointment
        </h2>


        <form onSubmit={handleSubmit}>


          {/* =========================
              DOCTOR
          ========================= */}

          <div className="form-group">

            <label>
              Select Doctor
            </label>


            <select
              value={doctorId}
              onChange={(e) =>
                setDoctorId(
                  e.target.value
                )
              }
              required
            >

              <option value="">
                -- Select Doctor --
              </option>


              {doctors.map((doctor) => {

                const id =
                  doctor.userId ??
                  doctor.user_id ??
                  doctor.id;

                return (

                  <option
                    key={id}
                    value={id}
                  >
                    {doctor.fullName}
                  </option>

                );

              })}

            </select>

          </div>


          {/* =========================
              PATIENT
          ========================= */}

          <div className="form-group">

            <label>
              Patient
            </label>


            <input
              type="text"
              value={patientName || ""}
              readOnly
            />

          </div>


          {/* =========================
              DATE
          ========================= */}

          <div className="form-group">

            <label>
              Appointment Date
            </label>


            <input
              type="date"
              value={appointmentDate}
              onChange={(e) =>
                setAppointmentDate(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* =========================
              TIME
          ========================= */}

          <div className="form-group">

            <label>
              Appointment Time
            </label>


            <input
              type="time"
              value={appointmentTime}
              onChange={(e) =>
                setAppointmentTime(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* =========================
              STATUS
          ========================= */}

          <div className="form-group">

            <label>
              Status
            </label>


            <input
              type="text"
              value={status}
              readOnly
            />

          </div>


          {/* =========================
              BOOK BUTTON
          ========================= */}

          <button type="submit">
            Book Appointment
          </button>


        </form>

      </div>

    </div>
  );
}

export default Appointment;