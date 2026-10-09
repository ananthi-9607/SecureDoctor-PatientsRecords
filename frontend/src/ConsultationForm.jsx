import { useState } from "react";
import API_BASE_URL from "./api";
import "./ConsultationForm.css";

function ConsultationForm({
  appointment,
  onBack,
  onConsultationSaved,
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [consultationId, setConsultationId] = useState(null);

  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instruction, setInstruction] = useState("");
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  const appointmentId =
    appointment?.appointmentId ??
    appointment?.appointment_id ??
    appointment?.id;

  const patientId =
    appointment?.patientId ??
    appointment?.patient_id;

  const appointmentDate =
    appointment?.appointmentDate ??
    appointment?.appointment_date ??
    "Not available";

  const appointmentTime =
    appointment?.appointmentTime ??
    appointment?.appointment_time ??
    "Not available";

  // SAVE CONSULTATION
  const saveConsultation = async (e) => {
    e.preventDefault();

    if (appointmentId == null) {
      alert("Appointment ID is missing.");
      return;
    }

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
        appointmentId: Number(appointmentId),
        diagnosis: diagnosis.trim(),
        encryptedNotes: notes.trim(),
      };

      const response = await fetch(
        `${API_BASE_URL}/consultations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(consultationData),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Consultation error:", responseText);
        throw new Error(
          responseText || "Failed to save consultation."
        );
      }

      let data = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Consultation was submitted, but the server returned an unexpected response."
          );
        }
      }

      const newConsultationId =
        data.consultId ??
        data.consult_id ??
        data.id;

      if (newConsultationId == null) {
        throw new Error(
          "Consultation saved, but the response did not contain a consultation ID."
        );
      }

      setConsultationId(newConsultationId);

      alert(
        "Consultation saved successfully! Now add prescription."
      );
    } catch (error) {
      console.error("Save consultation error:", error);

      alert(
        error.message || "Unable to save consultation."
      );
    } finally {
      setLoading(false);
    }
  };

  // ADD PRESCRIPTION
  const addPrescription = async () => {
    if (consultationId == null) {
      alert("Consultation ID is missing.");
      return;
    }

    if (!medicineName.trim()) {
      alert("Please enter medicine name.");
      return;
    }

    if (!dosage.trim()) {
      alert("Please enter dosage.");
      return;
    }

    if (!instruction.trim()) {
      alert("Please enter instruction.");
      return;
    }

    setPrescriptionLoading(true);

    try {
      const prescriptionData = {
        consultId: Number(consultationId),
        medicineName: medicineName.trim(),
        dosage: dosage.trim(),
        instruction: instruction.trim(),
      };

      const response = await fetch(
        `${API_BASE_URL}/prescriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Prescription error:", responseText);
        throw new Error(
          responseText || "Failed to save prescription."
        );
      }

      setMedicineName("");
      setDosage("");
      setInstruction("");

      alert("Prescription added successfully!");
    } catch (error) {
      console.error("Save prescription error:", error);

      alert(
        error.message || "Unable to save prescription."
      );
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // FINISH CONSULTATION
  const finishConsultation = () => {
    if (consultationId == null) {
      alert("Please save the consultation first.");
      return;
    }

    if (onConsultationSaved) {
      onConsultationSaved({
        consultId: consultationId,
      });
    }
  };

  return (
    <div className="consultation-page">
      <header className="consultation-header">
        <div className="consultation-brand">
          <div className="consultation-logo">✚</div>

          <div>
            <h2>SecureDoctor</h2>
            <span>Doctor Portal</span>
          </div>
        </div>

        <button
          type="button"
          className="consultation-back-button"
          onClick={onBack}
        >
          ← Back
        </button>
      </header>

      <main className="consultation-container">
        <div className="consultation-title">
          <span>CONSULTATION</span>
          <h1>Patient Consultation</h1>

          <p>
            Record the consultation details securely for this
            appointment.
          </p>
        </div>

        {/* APPOINTMENT DETAILS */}
        <section className="appointment-info-card">
          <h3>Appointment Information</h3>

          <div className="appointment-info-grid">
            <div>
              <span>Patient ID</span>
              <strong>{patientId ?? "Not available"}</strong>
            </div>

            <div>
              <span>Appointment Date</span>
              <strong>{appointmentDate}</strong>
            </div>

            <div>
              <span>Appointment Time</span>
              <strong>{appointmentTime}</strong>
            </div>
          </div>
        </section>

        {/* CONSULTATION FORM */}
        {!consultationId && (
          <form
            className="consultation-form"
            onSubmit={saveConsultation}
          >
            <div className="form-section">
              <label htmlFor="diagnosis">Diagnosis</label>

              <input
                id="diagnosis"
                type="text"
                placeholder="Enter diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>

            <div className="form-section">
              <label htmlFor="consultation-notes">
                Consultation Notes
              </label>

              <textarea
                id="consultation-notes"
                rows={8}
                placeholder="Enter consultation notes, observations and recommendations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
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
                {loading ? "Saving..." : "Save Consultation"}
              </button>
            </div>
          </form>
        )}

        {/* PRESCRIPTION SECTION */}
        {consultationId != null && (
          <section className="prescription-section">
            <div className="prescription-title">
              <span>PRESCRIPTION</span>
              <h2>Add Medicines</h2>

              <p>
                Add the medicines prescribed for this consultation.
              </p>
            </div>

            <div className="consultation-id-box">
              <span>CONSULTATION ID</span>
              <strong>#{consultationId}</strong>
            </div>

            <div className="prescription-form">
              <div className="form-section">
                <label htmlFor="medicine-name">Medicine Name</label>

                <input
                  id="medicine-name"
                  type="text"
                  placeholder="Example: Paracetamol"
                  value={medicineName}
                  onChange={(e) =>
                    setMedicineName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-section">
                <label htmlFor="dosage">Dosage</label>

                <input
                  id="dosage"
                  type="text"
                  placeholder="Example: 500mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                />
              </div>

              <div className="form-section">
                <label htmlFor="instruction">Instruction</label>

                <input
                  id="instruction"
                  type="text"
                  placeholder="Example: Take after food"
                  value={instruction}
                  onChange={(e) =>
                    setInstruction(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="button"
                className="add-prescription-button"
                onClick={addPrescription}
                disabled={prescriptionLoading}
              >
                {prescriptionLoading
                  ? "Adding..."
                  : "+ Add Prescription"}
              </button>
            </div>

            <div className="consultation-actions">
              <button
                type="button"
                className="cancel-consultation-button"
                onClick={onBack}
              >
                Back
              </button>

              <button
                type="button"
                className="save-consultation-button"
                onClick={finishConsultation}
              >
                Finish Consultation
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ConsultationForm;