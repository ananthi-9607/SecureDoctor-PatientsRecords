import { useState } from "react";
import "./App.css";
import Appointment from "./Appointment";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Patient");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // REGISTRATION
    // =========================
    if (isRegister) {
      try {
        const response = await fetch(
          "http://localhost:8080/users",
          {
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
          }
        );

        if (response.ok) {
          const data = await response.json();

          console.log("Registration successful:", data);

          alert("Registration successful!");

          setFullName("");
          setEmail("");
          setPassword("");
          setPhone("");
          setRole("Patient");

          // After registration, go back to Login
          setIsRegister(false);

        } else {
          const errorText = await response.text();

          console.error("Registration failed:", errorText);

          alert(`Registration failed: ${errorText}`);
        }

      } catch (error) {
        console.error("Backend connection error:", error);

        alert("Backend connection failed!");
      }

    // =========================
    // LOGIN
    // =========================
    } else {

      try {
        const response = await fetch(
          "http://localhost:8080/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        if (response.ok) {

          const data = await response.text();

          console.log("Login successful:", data);

          alert("Login successful!");

          setIsLoggedIn(true);

        } else {

          const errorText = await response.text();

          console.error("Login failed:", errorText);

          alert("Invalid email or password");
        }

      } catch (error) {

        console.error("Backend connection error:", error);

        alert("Backend connection failed!");
      }
    }
  };

  // =========================
  // AFTER LOGIN
  // =========================
  if (isLoggedIn) {
    return <Appointment />;
  }

  // =========================
  // LOGIN / REGISTER PAGE
  // =========================
  return (
    <div className="login-page">

      <div className="login-card">

        <h1>SecureDoctor</h1>

        <p className="subtitle">
          Secure Doctor-Patient Records
        </p>

        <h2>
          {isRegister ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}
          {isRegister && (
            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                required
              />

            </div>
          )}

          {/* PHONE */}
          {isRegister && (
            <div className="form-group">

              <label>Phone</label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                required
              />

            </div>
          )}

          {/* ROLE */}
          {isRegister && (
            <div className="form-group">

              <label>Role</label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >

                <option value="Patient">
                  Patient
                </option>

                <option value="Doctor">
                  Doctor
                </option>

              </select>

            </div>
          )}

          {/* EMAIL */}
          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit">

            {isRegister
              ? "Register"
              : "Login"}

          </button>

        </form>

        {/* LOGIN / REGISTER SWITCH */}
        <p className="register-text">

          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            onClick={() =>
              setIsRegister(!isRegister)
            }
          >

            {isRegister
              ? " Login"
              : " Register"}

          </span>

        </p>

      </div>

    </div>
  );
}

export default App;