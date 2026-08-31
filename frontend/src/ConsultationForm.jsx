import { useState } from "react";
import "./ConsultationForm.css";

function ConsultationForm({
  appointment,
  onBack,
  onConsultationSaved
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const saveConsultation = async (e) => {
    e.preventDefault();

    if (!diagnosis.trim()) {
      alert("Please enter the diagnosis.");
      return;
    }

    if (!notes.trim()) {
      alert("Please enter consultation notes.");
      return;
    }

    setLoading(true);

    try {
      const consultationData = {
        appointmentId: appointment.appointmentId,
        diagnosis: diagnosis,
        encryptedNotes: notes
      };

      const response = await fetch(
        "http://localhost:8080/consultations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(consultationData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Consultation error:", errorText);

        throw new Error("Failed to save consultation");
      }

      const data = await response.json();

      console.log(
        "Consultation saved:",
        data
      );

      alert("Consultation saved successfully!");

      if (onConsultationSaved) {
        onConsultationSaved(data);
      }

    } catch (error) {
      console.error(
        "Save consultation error:",
        error
      );

      alert(
        "Unable to save consultation."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-page">

      {/* HEADER */}

      <header className="consultation-header">

        <div className="consultation-brand">

          <div className="consultation-logo">
            ✚
          </div>

          <div>
            <h2>SecureDoctor</h2>
            <span>Doctor Portal</span>
          </div>

        </div>

        <button
          className="consultation-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </header>


      {/* MAIN CONTENT */}

      <main className="consultation-container">

        <div className="consultation-title">

          <span>
            CONSULTATION
          </span>

          <h1>
            Patient Consultation
          </h1>

          <p>
            Record the consultation details
            securely for this appointment.
          </p>

        </div>


        {/* APPOINTMENT DETAILS */}

        <section className="appointment-info-card">

          <h3>
            Appointment Information
          </h3>

          <div className="appointment-info-grid">

            <div>

              <span>Patient ID</span>

              <strong>
                {appointment.patientId}
              </strong>

            </div>

            <div>

              <span>Appointment Date</span>

              <strong>
                {appointment.appointmentDate}
              </strong>

            </div>

            <div>

              <span>Appointment Time</span>

              <strong>
                {appointment.appointmentTime}
              </strong>

            </div>

          </div>

        </section>


        {/* CONSULTATION FORM */}

        <form
          className="consultation-form"
          onSubmit={saveConsultation}
        >

          <div className="form-section">

            <label>
              Diagnosis
            </label>

            <input
              type="text"
              placeholder="Enter diagnosis"
              value={diagnosis}
              onChange={(e) =>
                setDiagnosis(e.target.value)
              }
            />

          </div>


          <div className="form-section">

            <label>
              Consultation Notes
            </label>

            <textarea
              rows="8"
              placeholder="Enter consultation notes, observations and recommendations..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

          </div>


          <div className="consultation-actions">

            <button
              type="button"
              className="cancel-consultation-button"
              onClick={onBack}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-consultation-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Consultation"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default ConsultationForm;