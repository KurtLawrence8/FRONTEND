<template>
  <div class="page-layout">
    <div class="left-section">
      <div class="brand-container">
        <img src="../assets/1.png" alt="Logo" class="logo" />
        <p>Advanced Point of Sale and Inventory System</p>
      </div>
    </div>

    <div class="right-section">
      <form class="register-form" @submit.prevent="login">
        <h1>Login to your Account</h1>

        <div class="form-group">
          <input
            type="email"
            v-model="email"
            placeholder="Email Address"
            class="form-input"
          />
        </div>

        <div class="form-group password-group position-relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="form-input"
          />
          <i
            :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
            class="toggle-password-icon position-absolute"
            @click="togglePasswordVisibility"
          ></i>
        </div>

        <button type="submit" class="submit-button">Login</button>

        <div class="divider">
          <span>or</span>
        </div>

        <a @click="toregister()" class="register-link">
          Don't have an Account? Register
        </a>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/config";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false, // Variable for toggling password visibility
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    login() {
      axios
        .post(`${config.apiBaseURL}/adminlogin`, {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user_id", response.data.user.id);
            Swal.fire({
              title: "Login Successful!",
              text: "You are being redirected to the main page.",
              icon: "success",
              confirmButtonText: "Okay",
            }).then(() => {
              this.$router.push("/main");
            });
          } else {
            Swal.fire({
              title: "Login Failed",
              text: "Invalid username or password.",
              icon: "error",
              confirmButtonText: "Try Again",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "Login Failed",
            text: "Login failed. Please check your credentials.",
            icon: "error",
            confirmButtonText: "Okay",
          });
          console.error("Error:", error.response?.data || error);
        });
    },
    toregister() {
      this.$router.push("/register");
    },
  },
};
</script> 

<style scoped>
.password-group {
  display: flex;
  align-items: center;
}

.toggle-password-icon {
  cursor: pointer;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.page-layout {
  display: flex;
  height: 100vh;
  font-family: 'Georgia', serif;
  background-color: white;
}

.left-section {
  flex: 1;
  background: #f5e1fd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #4b0082; /* Enhanced contrast */
  text-align: center;
  padding: 3rem; /* Increased padding for breathing space */
  border-top-right-radius: 80px;
  border-bottom-right-radius: 80px;
  font-size: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* Subtle text shadow */
  font-family: 'Georgia', serif; /* Updated font */
}

.left-section h2 {
  font-style: italic;
  font-size: 48px;
  font-weight: bold;
  font-family: 'Georgia', serif; /* Updated font */
}

.brand-container .logo {
  width: 400px; /* Reduced size for proportionality */
  margin-bottom: 1rem;
}

.right-section {
  flex: 1;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Georgia', serif; /* Updated font */
}

.register-form {
  width: 80%;
  max-width: 600px;
}

.register-form h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #4b0082; /* Enhanced contrast */
  font-weight: bold;
  padding-bottom: 30px;
  font-family: 'Georgia', serif; /* Updated font */
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #f5e1fd;
  border-radius: 10px;
  font-size: 1rem;
  width: calc(50% - 1rem);
  height: 70px;
  font-family: 'Georgia', serif; /* Updated font */
}

.form-input:focus {
  border-color: #d4a4f5; /* Distinct border color */
  box-shadow: 0 0 5px #d4a4f5;
  outline: none;
}

.form-input:last-child {
  width: 100%;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: rgb(188, 14, 188);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  height: 60px;
  transition: background 0.3s ease, transform 0.2s ease;
  font-family: 'Georgia', serif; /* Updated font */
}

.submit-button:hover {
  background: purple;
  transform: scale(1.05);
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  color: #b0bec5;
  text-align: center;
}

.divider span {
  background: #ffffff;
  padding: 0 0.5rem;
}

.divider:before,
.divider:after {
  content: "";
  flex: 1;
  height: 1px;
  background: #b0bec5;
  margin: 0 0.5rem;
}

.register-link {
  color: gray;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-family: 'Georgia', serif; /* Updated font */
}

.register-link:hover {
  text-decoration: underline;
}
</style>
