<template>
    <div class="page-layout">
      <div class="left-section">
        <div class="brand-container">
          <img src="../assets/1.png" alt="Logo" class="logo" />
          <p>Advanced Point of Sale and Inventory System</p>
        </div>
      </div>
  
      <div class="right-section">
        <form class="register-form" @submit.prevent="register">
          <h1>Create an Account</h1>
          <div class="form-group">
            <input type="text" v-model="name" placeholder="First Name" class="form-input" required/>
            <input type="text" v-model="middle_name" placeholder="Middle Name" class="form-input"/>
            <input type="text" v-model="last_name" placeholder="Last Name" class="form-input" required/>
          </div>

          <div class="form-group">
            <input type="date" v-model="birthday" placeholder="Birthday" class="form-input" required/>
            <select v-model="sex" id="sex" class="form-input" required>
              <option disabled value="">Select Sex</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          
          <div class="form-group">
            <input type="text" v-model="company_name" placeholder="Company Name" class="form-input" required/>
            <input type="text" v-model="address" placeholder="Address" class="form-input" required/>
            <input type="number" v-model="contact_number" placeholder="Contact Number (ex: 9123456789)" class="form-input" minlength="10" maxlength="10" required/>
          </div>
          
          <div class="form-group">
            <input type="email" v-model="email" placeholder="Email Address" class="form-input" required/>
            <div class="password-group position-relative">
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
          </div>

          <button type="submit" class="submit-button">Register</button>

          <div class="divider">
            <span>or</span>
          </div>
          
          <a @click="tologin" class="register-link">Already have an Account? Login</a>
        </form>
      </div>
    </div>
  </template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';  // Import SweetAlert2
import config from '@/config';

export default {
  data() {
    return {
      name: "",
      middle_name: "",
      last_name: "",
      birthday: "",
      sex: "M",
      company_name: "",
      address: "",
      contact_number: "",
      type: "admin",
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    register() {
      // Check if all fields are filled
      if (this.name === "" || this.middle_name === "" || this.last_name === "" || this.birthday === "" ||
        this.sex === "" || this.company_name === "" || this.address === "" || this.contact_number === "" ||
        this.type === "" || this.email === "" || this.password === "") {
        
        Swal.fire({
          icon: 'warning',
          title: 'Input all Fields',
          text: 'Please fill in all required fields.',
        });
        return; // Stop further execution if fields are missing
      }

      axios.post(`${config.apiBaseURL}/adminregister`, {
        name: this.name,
        middle_name: this.middle_name,
        last_name: this.last_name,
        birthday: this.birthday,
        sex: this.sex,
        company_name: this.company_name,
        address: this.address,
        contact_number: this.contact_number,
        type: this.type,
        email: this.email,
        password: this.password,
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Registered Successfully',
            text: 'You have been registered successfully!',
          }).then(() => {
            this.$router.push("/"); // Redirect after success
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Something Went Wrong',
            text: 'There was an issue with your registration.',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
        });
      });
    },
    tologin() {
      this.$router.push("/");
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
  