import { useState } from "react";
import "./ConsultationForm.css";

function ConsultationForm({
  appointment,
  onBack,
  onConsultationSaved
}) {
  // =========================
  // CONSULTATION STATES
  // =========================

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // PRESCRIPTION STATES
  // =========================

  const [consultationId, setConsultationId] = useState(null);

  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instruction, setInstruction] = useState("");

  const [prescriptionLoading, setPrescriptionLoading] =
    useState(false);

  // =========================
  // SAVE CONSULTATION
  // =========================

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
        appointmentId:
          appointment.appointmentId ??
          appointment.appointment_id ??
          appointment.id,

        diagnosis: diagnosis,

        encryptedNotes: notes
      };

      console.log(
        "Saving consultation:",
        consultationData
      );

      const response = await fetch(
        "https://securedoctor-patientsrecords-production.up.railway.app/consultations",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(
            consultationData
          )
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Consultation error:",
          errorText
        );

        throw new Error(
          "Failed to save consultation"
        );
      }

      const data =
        await response.json();

      console.log(
        "Consultation saved:",
        data
      );

      // =========================
      // GET CONSULTATION ID
      // =========================

      const newConsultationId =
        data.consultId ??
        data.consult_id ??
        data.id;

      setConsultationId(
        newConsultationId
      );

      alert(
        "Consultation saved successfully! Now add prescription."
      );

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

  // =========================
  // ADD PRESCRIPTION
  // =========================

  const addPrescription = async () => {
    if (!consultationId) {
      alert(
        "Consultation ID is missing."
      );
      return;
    }

    if (!medicineName.trim()) {
      alert(
        "Please enter medicine name."
      );
      return;
    }

    if (!dosage.trim()) {
      alert(
        "Please enter dosage."
      );
      return;
    }

    if (!instruction.trim()) {
      alert(
        "Please enter instruction."
      );
      return;
    }

    setPrescriptionLoading(true);

    try {
      const prescriptionData = {
        consultId: consultationId,

        medicineName: medicineName,

        dosage: dosage,

        instruction: instruction
      };

      console.log(
        "Saving prescription:",
        prescriptionData
      );

      const response = await fetch(
        "https://securedoctor-patientsrecords-production.up.railway.app/prescriptions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(
            prescriptionData
          )
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Prescription error:",
          errorText
        );

        throw new Error(
          "Failed to save prescription"
        );
      }

      const data =
        await response.json();

      console.log(
        "Prescription saved:",
        data
      );

      // =========================
      // CLEAR INPUT FIELDS
      // =========================

      setMedicineName("");
      setDosage("");
      setInstruction("");

      alert(
        "Prescription added successfully!"
      );

    } catch (error) {
      console.error(
        "Save prescription error:",
        error
      );

      alert(
        "Unable to save prescription."
      );

    } finally {
      setPrescriptionLoading(
        false
      );
    }
  };

  // =========================
  // FINISH CONSULTATION
  // =========================

  const finishConsultation = () => {
    if (onConsultationSaved) {
      onConsultationSaved({
        consultId: consultationId
      });
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="consultation-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="consultation-header">

        <div className="consultation-brand">

          <div className="consultation-logo">
            ✚
          </div>

          <div>
            <h2>
              SecureDoctor
            </h2>

            <span>
              Doctor Portal
            </span>
          </div>

        </div>

        <button
          className="consultation-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

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


        {/* =========================
            APPOINTMENT DETAILS
        ========================= */}

        <section className="appointment-info-card">

          <h3>
            Appointment Information
          </h3>

          <div className="appointment-info-grid">

            <div>
              <span>
                Patient ID
              </span>

              <strong>
                {appointment.patientId}
              </strong>
            </div>


            <div>
              <span>
                Appointment Date
              </span>

              <strong>
                {appointment.appointmentDate}
              </strong>
            </div>


            <div>
              <span>
                Appointment Time
              </span>

              <strong>
                {appointment.appointmentTime}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            CONSULTATION FORM
        ========================= */}

        {!consultationId && (

          <form
            className="consultation-form"
            onSubmit={saveConsultation}
          >

            {/* DIAGNOSIS */}

            <div className="form-section">

              <label>
                Diagnosis
              </label>

              <input
                type="text"
                placeholder="Enter diagnosis"
                value={diagnosis}
                onChange={(e) =>
                  setDiagnosis(
                    e.target.value
                  )
                }
              />

            </div>


            {/* NOTES */}

            <div className="form-section">

              <label>
                Consultation Notes
              </label>

              <textarea
                rows="8"
                placeholder="Enter consultation notes, observations and recommendations..."
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
              />

            </div>


            {/* ACTIONS */}

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

        )}


        {/* =========================
            PRESCRIPTION SECTION
        ========================= */}

        {consultationId && (

          <section className="prescription-section">

            <div className="prescription-title">

              <span>
                PRESCRIPTION
              </span>

              <h2>
                Add Medicines
              </h2>

              <p>
                Add the medicines prescribed
                for this consultation.
              </p>

            </div>


            {/* CONSULTATION ID */}

            <div className="consultation-id-box">

              <span>
                CONSULTATION ID
              </span>

              <strong>
                #{consultationId}
              </strong>

            </div>


            {/* MEDICINE FORM */}

            <div className="prescription-form">

              {/* MEDICINE NAME */}

              <div className="form-section">

                <label>
                  Medicine Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Paracetamol"
                  value={medicineName}
                  onChange={(e) =>
                    setMedicineName(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* DOSAGE */}

              <div className="form-section">

                <label>
                  Dosage
                </label>

                <input
                  type="text"
                  placeholder="Example: 500mg"
                  value={dosage}
                  onChange={(e) =>
                    setDosage(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* INSTRUCTION */}

              <div className="form-section">

                <label>
                  Instruction
                </label>

                <input
                  type="text"
                  placeholder="Example: Take after food"
                  value={instruction}
                  onChange={(e) =>
                    setInstruction(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ADD BUTTON */}

              <button
                type="button"
                className="add-prescription-button"
                onClick={addPrescription}
                disabled={
                  prescriptionLoading
                }
              >

                {prescriptionLoading
                  ? "Adding..."
                  : "+ Add Prescription"}

              </button>

            </div>


            {/* =========================
                FINISH
            ========================= */}

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