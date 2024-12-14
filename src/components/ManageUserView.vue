<template>
  <h1>Manage Users</h1>
  <div class="container mt-4">
    <!-- Button and Search Bar Container -->
    <div class="d-flex justify-content-end mb-4">
      <!-- Search Bar -->
      <input
        type="text"
        class="form-control search-bar"
        v-model="searchQuery"
        placeholder="Search for an account"
      />

      <!-- Register Button -->
      <button class="btn add-users-btn ms-3" @click="openRegisterModal">+ Add User</button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Full Name</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">User Type</th>
            <th scope="col">Contact Number</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td>{{ (currentPage - 1) * itemsPerPage + (index + 1) }}</td>
            <td>{{ user.name }} {{ user.middle_name }} {{ user.last_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.address }}</td>
            <td>{{ user.type }}</td>
            <td>{{ user.contact_number }}</td>
            <td>
              <button class="btn btn-warning" @click="openEditModal(user)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger ms-2" @click="deleteUser(user.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="d-flex justify-content-center mt-4">
      <button
        class="btn btn-secondary me-2"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-secondary ms-2"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>

    <!-- Register User Modal -->
    <div v-if="showRegisterModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create an Account</h5>
            <button type="button" class="btn-close" @click="closeRegisterModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="registerUser">
              <div class="container">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="name">First Name</label>
                      <input type="text" class="form-control" v-model="newUserDetails.name" id="name" required />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="middle_name">Middle Name</label>
                      <input type="text" class="form-control" v-model="newUserDetails.middle_name" id="middle_name" />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="last_name">Last Name</label>
                      <input type="text" class="form-control" v-model="newUserDetails.last_name" id="last_name" required />
                    </div>
                  </div>
                </div>
              
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="birthday">Birthday</label>
                      <input type="date" class="form-control" v-model="newUserDetails.birthday" id="birthday" required />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="sex">Sex</label>
                      <select class="form-control" v-model="newUserDetails.sex" id="sex" required>
                        <option value="" disabled selected>Select Sex</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="type">Type</label>
                      <select class="form-control" v-model="newUserDetails.type" id="type" required>
                        <option value="" disabled selected>Select Type</option>
                        <option value="cashier">Cashier</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>
                </div>
              
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="address">Address</label>
                      <input type="text" class="form-control" v-model="newUserDetails.address" id="address" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="contact_number">Contact Number</label>
                      <input type="text" class="form-control" v-model="newUserDetails.contact_number" id="contact_number" required />
                    </div>
                  </div>
                </div>
              
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email">Email</label>
                      <input type="email" class="form-control" v-model="newUserDetails.email" id="email" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="password">Password</label>
                      <input type="password" class="form-control" v-model="newUserDetails.password" id="password" required />
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeRegisterModal">Close</button>
                <button class="btn btn-primary" type="submit">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit User</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateUser">
              <div class="container">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="editName">First Name</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="currentUser.name"
                        id="editName"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="editMiddleName">Middle Name</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="currentUser.middle_name"
                        id="editMiddleName"
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="editLastName">Last Name</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="currentUser.last_name"
                        id="editLastName"
                        required
                      />
                    </div>
                  </div>
                </div>
              
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="editBirthday">Birthday</label>
                      <input
                        type="date"
                        class="form-control"
                        v-model="currentUser.birthday"
                        id="editBirthday"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="editSex">Sex</label>
                      <select
                        class="form-control"
                        v-model="currentUser.sex"
                        id="editSex"
                        required
                      >
                        <option value="" disabled selected>Select Sex</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="editType">User Type</label>
                      <select
                        class="form-control"
                        v-model="currentUser.type"
                        id="editType"
                        required
                      >
                        <option value="" disabled selected>Select Type</option>
                        <option value="cashier">Cashier</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>
                </div>
              
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="editAddress">Address</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="currentUser.address"
                        id="editAddress"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="editContactNumber">Contact Number</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="currentUser.contact_number"
                        id="editContactNumber"
                        required
                      />
                    </div>
                  </div>
                </div>
              
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="editEmail">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        v-model="currentUser.email"
                        id="editEmail"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="editPassword">Password</label>
                      <input
                        type="password"
                        class="form-control"
                        v-model="currentUser.password"
                        id="editPassword"
                      />
                    </div>
                  </div>
                </div>
              </div>   

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeEditModal">Close</button>
                <button class="btn btn-primary" type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import config from '@/config';

export default {
  data() {
    return {
      usersList: [], // Store the list of users for displaying
      token: "",
      user_id: "",
      showRegisterModal: false, // Modal visibility flag
      showEditUserModal: false, // Modal visibility flag for editing
      currentUser: {}, // Store the current user details for editing
      newUserDetails: {
        name: "",
        middle_name: "",
        last_name: "",
        birthday: "",
        sex: "",
        address: "",
        contact_number: "",
        type: "",
        email: "",
        password: "",
      },
      searchQuery: "",
      currentPage: 1, // Current page number for pagination
      itemsPerPage: 5, // Number of users per page
    };
  },
  computed: {
    // Filtered users based on the search query
    filteredUsers() {
      return this.usersList.filter((user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // Pagination logic
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    // Paginated users for current page
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
  },
  methods: {
    // Validate the form fields
    validateForm() {
      return Object.values(this.newUserDetails).every(value => value);
    },

    // Register a new user
    registerUser() {
      const admin_id = this.user_id;
      if (!admin_id) {
        Swal.fire({
          icon: 'warning',
          title: 'Admin ID not found',
          text: 'Please log in again.',
        });
        return;
      }

      if (!this.validateForm()) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Form',
          text: 'Please fill in all required fields.',
        });
        return;
      }

      axios
        .post(
          `${config.apiBaseURL}/register`,
          { admin_id, ...this.newUserDetails },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'User registered successfully!',
          });
          this.clearForm();
          this.getUsers(); // Refresh user list
        })
        .catch((error) => {
          console.error("Error during registration:", error.response?.data || error.message);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Error during registration. Please try again.',
          });
        });
    },

    // Clear the registration form
    clearForm() {
      this.newUserDetails = {
        name: "",
        middle_name: "",
        last_name: "",
        birthday: "",
        sex: "",
        address: "",
        contact_number: "",
        type: "",
        email: "",
        password: "",
      };
    },

    // Open modal to edit user details
    openEditModal(user) {
      this.currentUser = { ...user };
      this.showEditUserModal = true;
    },

    // Open the register modal
    openRegisterModal() {
      this.showRegisterModal = true;
    },

    // Close the register modal
    closeRegisterModal() {
      this.showRegisterModal = false;
    },

    // Close the edit modal
    closeEditModal() {
      this.showEditUserModal = false;
    },

    // Update user information
    updateUser() {
      const { id, name, middle_name, last_name, birthday, sex, address, contact_number, type, email, password } = this.currentUser;
      axios
        .put(
          `${config.apiBaseURL}/users/${id}`,
          { name, middle_name, last_name, birthday, sex, address, contact_number, type, email, password },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'User Updated',
            text: 'User updated successfully!',
          });
          this.closeEditModal();
          this.getUsers(); // Refresh the list of users after update
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Error updating user. Please try again.',
          });
        });
    },

    // Delete a user
    deleteUser(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this user?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${config.apiBaseURL}/users/${id}`, {
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'User Deleted',
                text: 'User deleted successfully!',
              });
              this.getUsers(); // Refresh the list of users after deletion
            })
            .catch((error) => {
              console.error("Error deleting user:", error);
              Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Error deleting user. Please try again.',
              });
            });
        }
      });
    },

    // Get the list of users
    getUsers() {
      this.token = localStorage.getItem("token");
      this.user_id = localStorage.getItem("user_id");

      axios
        .get(`${config.apiBaseURL}/users`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((response) => {
          this.usersList = response.data; // Store the list of users
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          Swal.fire({
            icon: 'error',
            title: 'Fetch Failed',
            text: 'Error fetching users. Please try again.',
          });
        });
    },

    // Change pagination page
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },

  mounted() {
    this.getUsers(); // Fetch users when component is mounted
  },
};
</script>


<style scoped>
/* General Styles */
body {
  font-family: 'Georgia', serif;
  background-color: #fdfaff; /* Light pastel background */
  color: #4b4b4b; /* Soft dark text for readability */
}

.container {
  max-width: 100%;
  margin: auto;
}

/* Heading Styles */
h1 {
  text-align: left;
  font-size: 2em;
  color: purple;
  padding: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 3px solid #9b59b6; /* Underline with purple */
  margin-bottom: 20px;
}

/* Search Bar */
.search-bar {
  width: 400px;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  font-size: 16px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: #66b3ff;
  box-shadow: 0 0 8px rgba(102, 179, 255, 0.5);
}

/* Add Users Button */
.add-users-btn {
  border-radius: 25px;
  font-size: 16px;
  padding: 10px 20px;
  background-color: purple; /* Soft pastel purple */
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-users-btn:hover {
  background-color: #e0b8f2; /* Slightly lighter shade on hover */
  transform: translateY(-2px);
}

.add-users-btn:focus {
  outline: none;
}

/* Modal Overlay */
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Modal Dialog */
.modal-dialog {
  background-color: #fff;
  border-radius: 15px;
  width: 700px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  max-width: 90%;
}

/* Modal Header */
.modal-header {
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-title {
  color: purple;
  font-weight: bold;
  font-size: 18px;
}

/* Close Button */
.btn-close {
  border: none;
  background: transparent;
  font-size: 18px;
  color: #007bff;
  cursor: pointer;
}

/* Modal Body */
.modal-body input,
.modal-body select {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 15px;
}

.modal-body input:focus,
.modal-body select:focus {
  outline: none;
  border-color: purple;
  box-shadow: 0 0 8px purple(102, 179, 255, 0.5);
}

.modal-body label {
  margin-bottom: 5px;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Buttons */
.btn {
  border-radius: 25px;
  padding: 8px 15px;
  font-size: 14px;
  transition: background-color 0.3s ease;
  border: none;
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #555;
}

.btn-primary {
  background-color: purple;
  color: white;
}

.btn-secondary:hover {
  background-color: #ddd;
}

.btn-primary:hover {
  background-color: rgb(223, 153, 223);
}

/* Table Design */
.table {
  font-size: 16px;
  text-align: center;
  height: 380px;
}

.table th, .table td {
  vertical-align: middle;
}

thead {
  background-color: #f8f9fa;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

/* Additional Buttons */
.btn-warning {
  background-color: #f0ad4e;
  color: white;
}

.btn-danger {
  background-color: #d9534f;
  color: white;
}

.btn-warning:hover {
  background-color: #ec971f;
}

.btn-danger:hover {
  background-color: #c9302c;
}
</style>





