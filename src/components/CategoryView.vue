<template>
  <h1>Manage Categories</h1>
  <div class="container mt-4">

    <!-- Button and Search Bar Container -->
    <div class="d-flex justify-content-end mb-4">
      <!-- Search Bar -->
      <input
        type="text"
        class="form-control search-bar"
        v-model="searchQuery"
        placeholder="Search categories"
      />

      <!-- Add Category Button -->
      <button class="btn add-category-btn ms-3" @click="showAddModal()">+ Add Category</button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Category Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, index) in paginatedCategories" :key="category.id">
            <td>{{ (currentPage - 1) * itemsPerPage + (index + 1) }}</td>
            <td>{{ category.name }}</td>
            <td>
              <button class="btn btn-warning" @click="showEditModal(category)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger ms-2" @click="deleteCategory(category.id)">
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

    <!-- Add Category Modal -->
    <div v-if="showAddCategoryModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Category</h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <label for="">Category:</label>
            <input
              type="text"
              class="form-control"
              v-model="newCategoryName"
              placeholder="Enter category name"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeAddModal">Close</button>
            <button class="btn btn-primary" @click="addCategory">
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Category</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <label for="">Category:</label>
            <input
              type="text"
              class="form-control"
              v-model="currentCategory.name"
              placeholder="Enter category name"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Close</button>
            <button class="btn btn-primary" @click="updateCategory">
              Save changes
            </button>
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
      categories: [],
      token: "",
      user_id: "",
      showModal: false,
      showAddCategoryModal: false,
      currentCategory: {},
      newCategoryName: "",
      searchQuery: "",
      currentPage: 1, // Current page number
      itemsPerPage: 5, // Number of categories per page
    };
  },
  computed: {
    // Filtered categories based on the search query
    filteredCategories() {
      return this.categories.filter((category) =>
        category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // Pagination logic
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    },
    // Paginated categories for current page
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCategories.slice(start, end);
    },
  },
  methods: {
    showAddModal() {
      this.newCategoryName = "";
      this.showAddCategoryModal = true;
    },
    closeAddModal() {
      this.showAddCategoryModal = false;
    },
    addCategory() {
      axios
        .post(
          `${config.apiBaseURL}/categories`,
          { name: this.newCategoryName },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        .then(() => {
          Swal.fire({
            title: "Success!",
            text: "Category added successfully!",
            icon: "success",
            confirmButtonText: "Okay",
          });
          this.getCategory(); // Refresh category list
          this.closeAddModal(); // Close modal
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "Error adding category.",
            icon: "error",
            confirmButtonText: "Okay",
          });
        });
    },
    getCategory() {
      this.token = localStorage.getItem("token");
      this.user_id = localStorage.getItem("user_id");

      axios
        .get(`${config.apiBaseURL}/categories`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    showEditModal(category) {
      this.currentCategory = { ...category };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    updateCategory() {
      const { id, name } = this.currentCategory;
      axios
        .put(
          `${config.apiBaseURL}/categories/${id}`,
          { name },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        .then(() => {
          Swal.fire({
            title: "Success!",
            text: "Category updated successfully!",
            icon: "success",
            confirmButtonText: "Okay",
          });
          this.getCategory();
          this.closeModal();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "Error updating category.",
            icon: "error",
            confirmButtonText: "Okay",
          });
        });
    },
    deleteCategory(categoryId) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this category?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${config.apiBaseURL}/categories/${categoryId}`, {
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then(() => {
              Swal.fire({
                title: "Deleted!",
                text: "Category has been deleted.",
                icon: "success",
                confirmButtonText: "Okay",
              });
              this.getCategory(); // Refresh category list
            })
            .catch((error) => {
              console.error(error);
              Swal.fire({
                title: "Error",
                text: "Error deleting category.",
                icon: "error",
                confirmButtonText: "Okay",
              });
            });
        }
      });
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },
  mounted() {
    this.getCategory();
  },
};
</script>

<style scoped>

/* General Styles */
body {
  font-family: 'Georgia', serif;
  background-color: #fdfaff;
  color: #4b4b4b;
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
  border-color: purple;
  box-shadow: 0 0 8px purple;
}

/* Add Category Button */
.add-category-btn {
  border-radius: 25px;
  font-size: 16px;
  padding: 10px 20px;
  background-color: purple;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-category-btn:hover {
  background-color: #e0b8f2;
  transform: translateY(-2px);
}

.add-category-btn:focus {
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
  width: 450px;
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
  color: purple;
  cursor: pointer;
}

/* Modal Body */
.modal-body input {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 15px;
  border-color: #e0b8f2;
}

.modal-body input:focus {
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
  border-color: #e0b8f2;
}

.btn-secondary:hover {
  background-color: #ddd;
}

.btn-primary:hover {
  background-color: rgb(220, 123, 220);
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

th{
  color: purple;
}

thead {
  background-color: #f8f9fa;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

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

