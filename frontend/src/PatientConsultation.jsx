import { useEffect, useState } from "react";
import "./PatientConsultation.css";

function PatientConsultation({
  patientId,
  patientName,
  onBack,
  onBookAppointment,
}) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD PATIENT CONSULTATIONS
  // =========================

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8080/consultations/patient/${patientId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load consultations");
        }

        const data = await response.json();

        console.log("Patient consultation:", data);

        const consultationData = Array.isArray(data) ? data : [];

        // =========================
        // LOAD PRESCRIPTIONS
        // FOR EACH CONSULTATION
        // =========================

        const consultationsWithPrescriptions = await Promise.all(
          consultationData.map(async (consultation) => {
            try {
              const prescriptionResponse = await fetch(
                `http://localhost:8080/prescriptions/consultation/${consultation.consultId}`
              );

              if (!prescriptionResponse.ok) {
                return {
                  ...consultation,
                  prescriptions: [],
                };
              }

              const prescriptionData =
                await prescriptionResponse.json();

              return {
                ...consultation,
                prescriptions: Array.isArray(prescriptionData)
                  ? prescriptionData
                  : [],
              };
            } catch (error) {
              console.error(
                `Prescription loading error for consultation ${consultation.consultId}:`,
                error
              );

              return {
                ...consultation,
                prescriptions: [],
              };
            }
          })
        );

        console.log(
          "Consultations with prescriptions:",
          consultationsWithPrescriptions
        );

        setConsultations(consultationsWithPrescriptions);
      } catch (error) {
        console.error(
          "Consultation loading error:",
          error
        );

        setError("Unable to load consultations.");
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchConsultations();
    }
  }, [patientId]);

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
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  // =========================
  // PATIENT INITIAL
  // =========================

  const patientInitial =
    patientName
      ?.charAt(0)
      ?.toUpperCase() || "P";

  return (
    <div className="consultation-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="consultation-sidebar">

        <div className="consultation-brand">

          <div className="consultation-logo">
            ✚
          </div>

          <div>
            <h2>
              SecureDoctor
            </h2>

            <p>
              Patient Portal
            </p>
          </div>

        </div>

        <nav className="consultation-nav">

          <button
            className="consultation-nav-item"
            onClick={onBack}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="consultation-nav-item"
            onClick={onBookAppointment}
          >
            <span>+</span>
            Book Appointment
          </button>

          <button
            className="consultation-nav-item active"
          >
            <span>📋</span>
            My Consultations
          </button>

        </nav>

        <div className="consultation-security">

          <div className="security-shield">
            🛡
          </div>

          <div>
            <strong>
              Secure Medical Records
            </strong>

            <p>
              Your data is protected
            </p>
          </div>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="consultation-main">

        {/* =========================
            HEADER
        ========================= */}

        <header className="consultation-header">

          <div>

            <span>
              MEDICAL RECORDS
            </span>

            <h1>
              My Consultations
            </h1>

            <p>
              View your diagnosis and
              consultation notes securely.
            </p>

          </div>

          <div className="consultation-profile">

            <div className="consultation-avatar">
              {patientInitial}
            </div>

            <div>

              <strong>
                {patientName || "Patient"}
              </strong>

              <span>
                Patient
              </span>

            </div>

          </div>

        </header>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <div className="consultation-loading">

            <div className="loading-spinner">
              ⏳
            </div>

            <h3>
              Loading consultations...
            </h3>

            <p>
              Retrieving your secure
              medical records.
            </p>

          </div>

        )}

        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (

          <div className="consultation-error">

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

          </div>

        )}

        {/* =========================
            NO CONSULTATIONS
        ========================= */}

        {!loading &&
          !error &&
          consultations.length === 0 && (

            <div className="no-consultation">

              <div className="empty-icon">
                📋
              </div>

              <h2>
                No consultations yet
              </h2>

              <p>
                Your consultation records
                will appear here after your
                doctor completes a consultation.
              </p>

              <button
                onClick={onBookAppointment}
              >
                + Book Appointment
              </button>

            </div>

        )}

        {/* =========================
            CONSULTATION LIST
        ========================= */}

        {!loading &&
          !error &&
          consultations.length > 0 && (

            <div className="consultation-list">

              {consultations.map((consultation) => (

                <div
                  className="consultation-card"
                  key={consultation.consultId}
                >

                  {/* =========================
                      CONSULTATION HEADER
                  ========================= */}

                  <div className="consultation-card-header">

                    <div>

                      <span className="consultation-label">
                        CONSULTATION
                      </span>

                      <h2>
                        Consultation #
                        {consultation.consultId}
                      </h2>

                    </div>

                    <div className="consultation-date">
                      📅{" "}
                      {formatDate(
                        consultation.consultationDate
                      )}
                    </div>

                  </div>

                  {/* =========================
                      CONSULTATION DETAILS
                  ========================= */}

                  <div className="consultation-details">

                    {/* APPOINTMENT */}

                    <div className="detail-box">

                      <span>
                        APPOINTMENT ID
                      </span>

                      <strong>
                        #{consultation.appointmentId}
                      </strong>

                    </div>

                    {/* DIAGNOSIS */}

                    <div className="detail-box diagnosis-box">

                      <span>
                        DIAGNOSIS
                      </span>

                      <strong>
                        🩺{" "}
                        {consultation.diagnosis ||
                          "Not available"}
                      </strong>

                    </div>

                  </div>

                  {/* =========================
                      DOCTOR NOTES
                  ========================= */}

                  <div className="consultation-notes">

                    <span>
                      📝 DOCTOR'S NOTES
                    </span>

                    <p>
                      {consultation.encryptedNotes ||
                        "No notes available."}
                    </p>

                  </div>

                  {/* =========================
                      PRESCRIPTIONS
                  ========================= */}

                  <div className="patient-prescription-section">

                    <div className="prescription-heading">

                      <span>
                        💊 PRESCRIPTIONS
                      </span>

                      <strong>
                        Medicines prescribed
                      </strong>

                    </div>

                    {/* =========================
                        PRESCRIPTION TABLE
                    ========================= */}

                    {consultation.prescriptions &&
                    consultation.prescriptions.length > 0 ? (

                      <div className="patient-prescription-table-wrapper">

                        <table className="patient-prescription-table">

                          <thead>
                            <tr>
                              <th>MEDICINE</th>
                              <th>DOSAGE</th>
                              <th>INSTRUCTION</th>
                            </tr>
                          </thead>

                          <tbody>

                            {consultation.prescriptions.map(
                              (prescription) => (

                                <tr
                                  key={
                                    prescription.prescriptId
                                  }
                                >

                                  <td>
                                    💊{" "}
                                    {prescription.medicineName}
                                  </td>

                                  <td>
                                    {prescription.dosage ||
                                      "Not specified"}
                                  </td>

                                  <td>
                                    {prescription.instruction ||
                                      "Not specified"}
                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>

                    ) : (

                      <div className="no-prescription">

                        💊 No prescriptions available
                        for this consultation.

                      </div>

                    )}

                  </div>

                  {/* =========================
                      SECURITY NOTE
                  ========================= */}

                  <div className="consultation-security-note">

                    🔒 This consultation and
                    prescription information was
                    securely retrieved for
                    authorized patient access.

                  </div>

                </div>

              ))}

            </div>

        )}

      </main>

    </div>
  );
}

export default PatientConsultation;