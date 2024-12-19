<template>
  <h1>Profile</h1>
  <div class="container mt-4">
    <form @submit.prevent="updateAdmin" class="needs-validation" novalidate>
      <div class="row mb-3">
        <div class="col-md-4">
          <label for="name" class="form-label">Name:</label>
          <input type="text" v-model="form.name" id="name" class="form-control" required maxlength="50" />
        </div>
        <div class="col-md-4">
          <label for="middle_name" class="form-label">Middle Name:</label>
          <input type="text" v-model="form.middle_name" id="middle_name" class="form-control" maxlength="20" />
        </div>
        <div class="col-md-4">
          <label for="last_name" class="form-label">Last Name:</label>
          <input type="text" v-model="form.last_name" id="last_name" class="form-control" required maxlength="20" />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="birthday" class="form-label">Birthday:</label>
          <input type="date" v-model="form.birthday" id="birthday" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label for="sex" class="form-label">Sex:</label>
          <select v-model="form.sex" id="sex" class="form-select" required>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="company_name" class="form-label">Company Name:</label>
          <input type="text" v-model="form.company_name" id="company_name" class="form-control" required maxlength="30" />
        </div>
        <div class="col-md-6">
          <label for="address" class="form-label">Address:</label>
          <input type="text" v-model="form.address" id="address" class="form-control" required maxlength="50" />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="contact_number" class="form-label">Contact Number:</label>
          <input type="text" v-model="form.contact_number" id="contact_number" class="form-control" required maxlength="10" />
        </div>
        <div class="col-md-6">
          <label for="type" class="form-label">Type:</label>
          <input type="text" v-model="form.type" id="type" class="form-control" required maxlength="10" />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="email" class="form-label">Email:</label>
          <input type="email" v-model="form.email" id="email" class="form-control" required maxlength="255" />
        </div>
        <div class="col-md-6">
          <label for="password" class="form-label">Password:</label>
          <input type="password" v-model="form.password" id="password" class="form-control" minlength="8" maxlength="16" />
        </div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn px-4">Update</button>
      </div>
    </form>
  </div>
</template>

  <script>
  import axios from 'axios';
  import Swal from "sweetalert2";
  import config from '@/config';
  
  export default {
    data() {
      return {
        form: {
          name: '',
          middle_name: '',
          last_name: '',
          birthday: '',
          sex: '',
          company_name: '',
          address: '',
          contact_number: '',
          type: '',
          email: '',
          password: ''
        },
        token: '' // Replace this with the logic to retrieve the user's token
      };
    },
    methods: {
      async updateAdmin() {
        try {
          const id = this.$route.params.id; // Get the admin ID from route parameters or pass it appropriately
          const response = await axios.put(`${config.apiBaseURL}/admins/${id}`, this.form, {
            headers: { Authorization: `Bearer ${this.token}` }
          });
          Swal.fire('Success', response.data.response, 'success');
        } catch (error) {
          Swal.fire('Error', error.response.data.message || 'An error occurred', 'error');
        }
      }
    }
  };
  </script>
  
<style scoped>
.container {
  max-width: 100%;
}
.btn {
  padding: 0.5em 1em;
  font-size: 1.1em;
  background-color: purple;
  color: white;
}
.btn:hover{
  background-color: #d3abe5;
}
input{
  height: 50px;
}

select{
  height: 50px;
}

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
</style>