import { useState } from "react";

import "./App.css";

import DoctorDashboard from "./DoctorDashboard";
import MyAppointments from "./MyAppointments";
import AvailableSlots from "./AvailableSlots";
import PatientConsultation from "./PatientConsultation";

function App() {

  // ==================================================
  // LOGIN / REGISTER STATE
  // ==================================================

  const [isRegister, setIsRegister] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);


  // ==================================================
  // LOGGED-IN USER
  // ==================================================

  const [loggedInUser, setLoggedInUser] =
    useState(null);


  // ==================================================
  // FORM STATES
  // ==================================================

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [role, setRole] =
    useState("Patient");


  // ==================================================
  // PATIENT PAGE NAVIGATION
  //
  // appointments
  // booking
  // consultations
  // ==================================================

  const [patientPage, setPatientPage] =
    useState("appointments");


  // ==================================================
  // REGISTER / LOGIN
  // ==================================================

  const handleSubmit = async (e) => {
    console.log("HANDLE SUBMIT CALLED");

    e.preventDefault();


    // ==================================================
    // REGISTRATION
    // ==================================================

    if (isRegister) {

      try {

        const response = await fetch(
          "http://localhost:8080/users",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
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

          const data =
            await response.json();

          console.log(
            "Registration successful:",
            data
          );

          alert(
            "Registration successful! Please login."
          );


          // Clear fields

          setFullName("");
          setEmail("");
          setPassword("");
          setPhone("");
          setRole("Patient");


          // Go to login

          setIsRegister(false);

        } else {

          const errorText =
            await response.text();

          console.error(
            "Registration failed:",
            errorText
          );

          alert(
            errorText ||
            "Registration failed!"
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

    }


    // ==================================================
    // LOGIN
    // ==================================================

    else {

      try {

        const response = await fetch(
          "http://localhost:8080/users/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );


        if (response.ok) {

          const userData =
            await response.json();

          console.log(
            "Logged-in user:",
            userData
          );


          // Store user

          setLoggedInUser(
            userData
          );


          // Login success

          setIsLoggedIn(true);


          // Start patient at dashboard

          setPatientPage(
            "appointments"
          );

          alert(
            "Login successful!"
          );

        } else {

          const errorText =
            await response.text();

          console.error(
            "Login failed:",
            errorText
          );

          alert(
            errorText ||
            "Invalid email or password"
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

    }

  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

    setIsLoggedIn(false);

    setLoggedInUser(null);

    setEmail("");

    setPassword("");

    setPatientPage(
      "appointments"
    );

  };


  // ==================================================
  // AFTER LOGIN
  // ==================================================

  if (
    isLoggedIn &&
    loggedInUser
  ) {

    // Get user ID safely

    const userId =
      loggedInUser.userId ??
      loggedInUser.user_id ??
      loggedInUser.id;


    // ==================================================
    // DOCTOR DASHBOARD
    // ==================================================

    if (
      loggedInUser.role &&
      loggedInUser.role
        .toLowerCase() === "doctor"
    ) {

      return (

        <DoctorDashboard

          doctorId={userId}

          doctorName={
            loggedInUser.fullName
          }

          onLogout={
            handleLogout
          }

        />

      );

    }


    // ==================================================
    // PATIENT DASHBOARD
    // ==================================================

    if (
      patientPage ===
      "appointments"
    ) {

      return (

        <MyAppointments

          patientId={userId}

          patientName={
            loggedInUser.fullName
          }


          // Book Appointment

          onBookAppointment={() =>
            setPatientPage(
              "booking"
            )
          }


          // My Consultations

          onViewConsultations={() =>
            setPatientPage(
              "consultations"
            )
          }
           onLogout={handleLogout}

        />

      );

    }


    // ==================================================
    // PATIENT CONSULTATIONS
    // ==================================================

    if (
      patientPage ===
      "consultations"
    ) {

      return (

        <PatientConsultation

          patientId={userId}

          patientName={
            loggedInUser.fullName
          }


          // Back to dashboard

          onBack={() =>
            setPatientPage(
              "appointments"
            )
          }


          // Book Appointment

          onBookAppointment={() =>
            setPatientPage(
              "booking"
            )
          }

        />

      );

    }


    // ==================================================
    // AVAILABLE SLOTS / BOOKING
    // ==================================================

    return (

      <AvailableSlots

        patientId={userId}


        // Back button

        onBack={() =>
          setPatientPage(
            "appointments"
          )
        }


        // After successful booking

        onBookingSuccess={() =>
          setPatientPage(
            "appointments"
          )
        }

      />

    );

  }


  // ==================================================
  // LOGIN / REGISTER PAGE
  // ==================================================

  return (

    <div className="login-page">

      <div className="login-card">


        {/* BRAND */}

        <h1>
          SecureDoctor
        </h1>

        <p className="subtitle">
          Secure Doctor-Patient Records
        </p>


        {/* TITLE */}

        <h2>

          {isRegister
            ? "Create Account"
            : "Login"}

        </h2>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
        >


          {/* FULL NAME */}

          {isRegister && (

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                required
              />

            </div>

          )}


          {/* PHONE */}

          {isRegister && (

            <div className="form-group">

              <label>
                Phone
              </label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                required
              />

            </div>

          )}


          {/* ROLE */}

          {isRegister && (

            <div className="form-group">

              <label>
                Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
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

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
          >

            {isRegister
              ? "Register"
              : "Login"}

          </button>

        </form>


        {/* SWITCH LOGIN / REGISTER */}

        <p className="register-text">

          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            onClick={() =>
              setIsRegister(
                !isRegister
              )
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