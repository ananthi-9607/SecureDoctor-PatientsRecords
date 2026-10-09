
import { useEffect, useState } from "react";
import "./PatientConsultation.css";
import API_BASE_URL from "./api";

function PatientConsultation({
  patientId,
  patientName,
  onBack,
  onBookAppointment,
}) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD PATIENT CONSULTATIONS AND PRESCRIPTIONS
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError("");

        if (!patientId) {
          throw new Error("Patient information is missing.");
        }

        const response = await fetch(
          `${API_BASE_URL}/consultations/patient/${patientId}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            errorText || "Failed to load consultations."
          );
        }

        const data = await response.json();
        const consultationData = Array.isArray(data) ? data : [];

        const consultationsWithPrescriptions = await Promise.all(
          consultationData.map(async (consultation) => {
            try {
              const consultationId =
                consultation.consultId ??
                consultation.consult_id;

              const prescriptionResponse = await fetch(
                `${API_BASE_URL}/prescriptions/consultation/${consultationId}`
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
            } catch (prescriptionError) {
              console.error(
                "Prescription loading error:",
                prescriptionError
              );

              return {
                ...consultation,
                prescriptions: [],
              };
            }
          })
        );

        setConsultations(consultationsWithPrescriptions);
      } catch (fetchError) {
        console.error("Consultation loading error:", fetchError);
        setError(
          fetchError.message || "Unable to load consultations."
        );
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [patientId]);

  const formatDate = (date) => {
    if (!date) return "Not available";

    try {
      return new Date(`${date}T00:00:00`).toLocaleDateString(
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

  const patientInitial =
    patientName?.charAt(0)?.toUpperCase() || "P";

  return (
    <div className="consultation-page">
      <aside className="consultation-sidebar">
        <div className="consultation-brand">
          <div className="consultation-logo">✚</div>

          <div>
            <h2>SecureDoctor</h2>
            <p>Patient Portal</p>
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

          <button className="consultation-nav-item active">
            <span>📋</span>
            My Consultations
          </button>
        </nav>

        <div className="consultation-security">
          <div className="security-shield">🛡</div>

          <div>
            <strong>Secure Medical Records</strong>
            <p>Your data is protected</p>
          </div>
        </div>
      </aside>

      <main className="consultation-main">
        <header className="consultation-header">
          <div>
            <span>MEDICAL RECORDS</span>
            <h1>My Consultations</h1>
            <p>
              View your diagnosis and consultation notes securely.
            </p>
          </div>

          <div className="consultation-profile">
            <div className="consultation-avatar">
              {patientInitial}
            </div>

            <div>
              <strong>{patientName || "Patient"}</strong>
              <span>Patient</span>
            </div>
          </div>
        </header>

        {loading && (
          <div className="consultation-loading">
            <div className="loading-spinner">⏳</div>
            <h3>Loading consultations...</h3>
            <p>Retrieving your secure medical records.</p>
          </div>
        )}

        {!loading && error && (
          <div className="consultation-error">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && consultations.length === 0 && (
          <div className="no-consultation">
            <div className="empty-icon">📋</div>
            <h2>No consultations yet</h2>
            <p>
              Your consultation records will appear here after
              your doctor completes a consultation.
            </p>

            <button onClick={onBookAppointment}>
              + Book Appointment
            </button>
          </div>
        )}

        {!loading && !error && consultations.length > 0 && (
          <div className="consultation-list">
            {consultations.map((consultation) => {
              const consultationId =
                consultation.consultId ??
                consultation.consult_id;

              return (
                <div
                  className="consultation-card"
                  key={consultationId}
                >
                  <div className="consultation-card-header">
                    <div>
                      <span className="consultation-label">
                        CONSULTATION
                      </span>

                      <h2>
                        Consultation #{consultationId}
                      </h2>
                    </div>

                    <div className="consultation-date">
                      📅{" "}
                      {formatDate(
                        consultation.consultationDate ??
                        consultation.consultation_date
                      )}
                    </div>
                  </div>

                  <div className="consultation-details">
                    <div className="detail-box">
                      <span>APPOINTMENT ID</span>
                      <strong>
                        #
                        {consultation.appointmentId ??
                          consultation.appointment_id ??
                          "Not available"}
                      </strong>
                    </div>

                    <div className="detail-box diagnosis-box">
                      <span>DIAGNOSIS</span>
                      <strong>
                        🩺{" "}
                        {consultation.diagnosis ||
                          "Not available"}
                      </strong>
                    </div>
                  </div>

                  <div className="consultation-notes">
                    <span>📝 DOCTOR'S NOTES</span>
                    <p>
                      {consultation.encryptedNotes ??
                        consultation.encrypted_notes ??
                        "No notes available."}
                    </p>
                  </div>

                  <div className="patient-prescription-section">
                    <div className="prescription-heading">
                      <span>💊 PRESCRIPTIONS</span>
                      <strong>Medicines prescribed</strong>
                    </div>

                    {consultation.prescriptions?.length > 0 ? (
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
                              (prescription, index) => (
                                <tr
                                  key={
                                    prescription.prescriptId ??
                                    prescription.prescript_id ??
                                    index
                                  }
                                >
                                  <td>
                                    💊{" "}
                                    {prescription.medicineName ??
                                      prescription.medicine_name ??
                                      "Not available"}
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
                        💊 No prescriptions available for this
                        consultation.
                      </div>
                    )}
                  </div>

                  <div className="consultation-security-note">
                    🔒 This consultation and prescription
                    information was securely retrieved for
                    authorized patient access.
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default PatientConsultation;