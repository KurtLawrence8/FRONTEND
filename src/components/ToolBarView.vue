<template>
  <div class="toolbar">
    
    <img src="../assets/1.png" alt="Logo" class="logo" />

    <div class="company-details">
      <h1>{{ company_name }}</h1>
      <p>{{ address }}</p>
    </div>

    <div class="user-section">
      <p class="user-name">Welcome, {{ name }}</p>
      <button @click="logout" class="logout-btn">
        <i class="bi bi-box-arrow-right"></i>
        Log Out
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import config from '@/config';

export default {
  data() {
    return {
      token: "",
      user_id: "",
      name: "",
      company_name: "",
    };
  },
  methods: {
    // Get user data
    getUser() {
      this.token = localStorage.getItem('token');
      this.user_id = localStorage.getItem('user_id');

      axios
        .get(`${config.apiBaseURL}/admins/${this.user_id}`, {
          headers: { Authorization: 'Bearer ' + this.token },
        })
        .then((response) => {
          console.log(response.data);
          this.name = response.data.admins.name;
          this.company_name = response.data.admins.company_name;
          this.address = response.data.admins.address;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // Logout method with SweetAlert
    logout() {
      Swal.fire({
        title: 'Are you sure?',
        text: "You are about to log out.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with logout
          axios
            .post(
              `${config.apiBaseURL}/logout`,
              {},
              {
                headers: { Authorization: 'Bearer ' + this.token },
              }
            )
            .then(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user_id');
              this.$router.push('/');
              Swal.fire('Logged out!', 'You have successfully logged out.', 'success'); // Success alert
            })
            .catch((error) => {
              console.error(error);
              Swal.fire('Error!', 'Something went wrong while logging out.', 'error'); // Error alert
            });
        }
      });
    },
  },
  mounted() {
    this.getUser();
  },
};
</script>


<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  color: black;
  padding: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  font-family: Georgia;
  z-index: 100;
}

.company-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align text to the left */
  flex: 1; /* Take available space to push the user section to the right */
}

.company-details h1 {
  margin: 0;
  font-size: 24px;
}

.company-details p {
  margin: 0;
  font-size: 16px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px; /* Space between name and logout button */
}

.user-name {
  margin: 0;
  font-size: 16px;
}

.logout-btn {
  background-color: transparent;
  border: none;
  color: red;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px; /* Space between icon and text */
  transition: color 0.3s ease;
}

.logout-btn i {
  font-size: 1.25rem;
}

.logout-btn:hover {
  color: #ff2b2b;
}

.logo{
  width: 55px;
  padding-right: 10px;
}

</style>
