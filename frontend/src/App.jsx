
import { useState } from "react";
import "./App.css";

import API_BASE_URL from "./api";
import DoctorDashboard from "./DoctorDashboard";
import MyAppointments from "./MyAppointments";
import AvailableSlots from "./AvailableSlots";
import PatientConsultation from "./PatientConsultation";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Patient");

  const [patientPage, setPatientPage] = useState("appointments");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
            phone,
            role,
          }),
        });

        if (response.ok) {
          alert("Registration successful! Please login.");

          setFullName("");
          setEmail("");
          setPassword("");
          setPhone("");
          setRole("Patient");
          setIsRegister(false);
        } else {
          const errorText = await response.text();
          console.error("Registration failed:", errorText);
          alert(errorText || "Registration failed!");
        }
      } catch (error) {
        console.error("Backend connection error:", error);
        alert("Backend connection failed! Check whether the backend is running.");
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (response.ok) {
          const userData = await response.json();

          console.log("Logged-in user:", userData);

          setLoggedInUser(userData);
          setIsLoggedIn(true);
          setPatientPage("appointments");

          alert("Login successful!");
        } else {
          const errorText = await response.text();
          console.error("Login failed:", errorText);
          alert(errorText || "Invalid email or password");
        }
      } catch (error) {
        console.error("Backend connection error:", error);
        alert("Backend connection failed! Check whether the backend is running.");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setEmail("");
    setPassword("");
    setPatientPage("appointments");
  };

  if (isLoggedIn && loggedInUser) {
    const userId =
      loggedInUser.userId ??
      loggedInUser.user_id ??
      loggedInUser.id;

    const userName =
      loggedInUser.fullName ??
      loggedInUser.full_name ??
      "";

    if (
      loggedInUser.role &&
      loggedInUser.role.toLowerCase() === "doctor"
    ) {
      return (
        <DoctorDashboard
          doctorId={userId}
          doctorName={userName}
          onLogout={handleLogout}
        />
      );
    }

    if (patientPage === "appointments") {
      return (
        <MyAppointments
          patientId={userId}
          patientName={userName}
          onBookAppointment={() => setPatientPage("booking")}
          onViewConsultations={() => setPatientPage("consultations")}
          onLogout={handleLogout}
        />
      );
    }

    if (patientPage === "consultations") {
      return (
        <PatientConsultation
          patientId={userId}
          patientName={userName}
          onBack={() => setPatientPage("appointments")}
          onBookAppointment={() => setPatientPage("booking")}
        />
      );
    }

    return (
      <AvailableSlots
        patientId={userId}
        onBack={() => setPatientPage("appointments")}
        onBookingSuccess={() => setPatientPage("appointments")}
      />
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>SecureDoctor</h1>

        <p className="subtitle">
          Secure Doctor-Patient Records
        </p>

        <h2>{isRegister ? "Create Account" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="register-text">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Login" : " Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;