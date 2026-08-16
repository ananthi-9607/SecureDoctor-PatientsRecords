import { useState } from "react";
import "./App.css";
import Appointment from "./Appointment";
import DoctorDashboard from "./DoctorDashboard";

function App() {

  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Logged-in user details
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Patient");


  // =========================
  // REGISTER / LOGIN
  // =========================

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

          console.log(
            "Registration successful:",
            data
          );

          alert(
            "Registration successful!"
          );


          // Clear fields
          setFullName("");
          setEmail("");
          setPassword("");
          setPhone("");
          setRole("Patient");


          // Go back to Login
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


        // =========================
        // LOGIN SUCCESS
        // =========================

        if (response.ok) {

          // Backend now returns User object
          const userData =
            await response.json();


          console.log(
            "Logged-in user:",
            userData
          );

          console.log(
            "USER ID:",
            userData.userId
          );

          console.log(
            "USER NAME:",
            userData.fullName
          );

          console.log(
            "USER EMAIL:",
            userData.email
          );

          console.log(
            "USER ROLE:",
            userData.role
          );


          // Store logged-in user
          setLoggedInUser(userData);

          setIsLoggedIn(true);


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


  // =========================
  // AFTER LOGIN
  // =========================
if (isLoggedIn && loggedInUser) {

  const userId =
    loggedInUser.userId ??
    loggedInUser.user_id ??
    loggedInUser.id;

  // Doctor
  if (
    loggedInUser.role &&
    loggedInUser.role.toLowerCase() === "doctor"
  ) {

    return (
      <DoctorDashboard
        doctorId={userId}
        doctorName={loggedInUser.fullName}
      />
    );
  }

  // Patient
  return (
    <Appointment
      patientId={userId}
      patientName={loggedInUser.fullName}
    />
  );
}
  // =========================
  // LOGIN / REGISTER PAGE
  // =========================

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>
          SecureDoctor
        </h1>

        <p className="subtitle">
          Secure Doctor-Patient Records
        </p>


        <h2>
          {isRegister
            ? "Create Account"
            : "Login"}
        </h2>


        <form onSubmit={handleSubmit}>


          {/* =========================
              FULL NAME
          ========================= */}

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
                  setFullName(e.target.value)
                }
                required
              />

            </div>
          )}


          {/* =========================
              PHONE
          ========================= */}

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
                  setPhone(e.target.value)
                }
                required
              />

            </div>
          )}


          {/* =========================
              ROLE
          ========================= */}

          {isRegister && (

            <div className="form-group">

              <label>
                Role
              </label>

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


          {/* =========================
              EMAIL
          ========================= */}

          <div className="form-group">

            <label>
              Email
            </label>

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


          {/* =========================
              PASSWORD
          ========================= */}

          <div className="form-group">

            <label>
              Password
            </label>

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


          {/* =========================
              SUBMIT BUTTON
          ========================= */}

          <button type="submit">

            {isRegister
              ? "Register"
              : "Login"}

          </button>

        </form>


        {/* =========================
            LOGIN / REGISTER SWITCH
        ========================= */}

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