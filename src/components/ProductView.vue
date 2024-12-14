<template>
  <h1>Manage Products</h1>
  <div class="container mt-4">

    <!-- Search and Add Product Button -->
    <div class="d-flex justify-content-end mb-4">
      <input
        type="text"
        class="form-control search-bar"
        v-model="searchQuery"
        placeholder="Search products"
      />
      <button class="btn add-product-btn ms-3" @click="showAddModal()">+ Add Product</button>
    </div>

    <!-- Product Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Category</th>
            <th scope="col">Product Code</th>
            <th scope="col">Brand</th>
            <th scope="col">Product Name</th>
            <th scope="col">Size</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedProducts" :key="product.id">
            <td>{{ (currentPage - 1) * itemsPerPage + (index + 1) }}</td>
            <!-- Display category name -->
            <td>{{ product.category ? product.category.name : 'No Category' }}</td>
            <td>{{ product.product_code }}</td>
            <td>{{ product.brand }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.size }}</td>
            <td>₱ {{ product.price }}</td>
            <td>{{ product.qty }} pc/s</td>
            <td>
              <button class="btn btn-warning" @click="showEditModal(product)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger ms-2" @click="deleteProduct(product.id)">
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

    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Product</h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <label for="">Category:</label>
                <select v-model="newProductCategoryId" id="category" class="form-control" required>
                  <option value="">Select Category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="">Product Code:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newProductCode"
                  placeholder="Enter product code"
                />
              </div>
              <div class="col-md-4">
                <label for="">Brand:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newProductBrand"
                  placeholder="Enter brand name"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label for="">Product Name:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newProductName"
                  placeholder="Enter product name"
                />
              </div>
              <div class="col-md-6">
                <label for="">Size:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newProductSize"
                  placeholder="Enter product size"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label for="">Price:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newProductPrice"
                  placeholder="Enter product price"
                />
              </div> 
              <div class="col-md-6">
                <label for="">Quantity:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newProductQty"
                  placeholder="Enter product quantity"
                />
              </div> 
            </div>  
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeAddModal">Close</button>
            <button class="btn btn-primary" @click="addProduct">Add Product</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <label for="">Category:</label>
                <select v-model="currentProduct.category_id" id="category" class="form-control" required>
                  <option value="">Select Category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="">Product Code:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="currentProduct.product_code"
                  placeholder="Enter product code"
                />
              </div>
              <div class="col-md-4">
                <label for="">Brand Name:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="currentProduct.brand"
                  placeholder="Enter brand name"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label for="">Product Name:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="currentProduct.name"
                  placeholder="Enter product name"
                />
              </div>
              <div class="col-md-6">
                <label for="">Size:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="currentProduct.size"
                  placeholder="Enter product size"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label for="">Price:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="currentProduct.price"
                  placeholder="Enter product price"
                />
              </div>
              <div class="col-md-6">
                <label for="">Quantity:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="currentProduct.qty"
                  placeholder="Enter product quantity"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Close</button>
            <button class="btn btn-primary" @click="updateProduct">Save changes</button>
          </div>
        </div>
      </div>
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
      products: [], // List of products
      categories: [], // List of categories
      token: "",
      user_id: "",
      showModal: false, // Controls Edit Modal visibility
      showAddProductModal: false, // Controls Add Modal visibility
      currentProduct: {}, // Product being edited
      newProductName: "",
      newProductBrand: "",
      newProductCode: "",
      newProduct: "",
      newProductSize: "",
      newProductPrice: "",
      newProductQty: "",
      newProductCategoryId: "", // Category ID for the new product
      searchQuery: "", // Search term for filtering products
      currentPage: 1, // Current page number for pagination
      itemsPerPage: 5, // Products displayed per page
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const productName = product.name.toLowerCase();
        const categoryName = product.category ? product.category.name.toLowerCase() : '';
        const searchTerm = this.searchQuery.toLowerCase();
        return productName.includes(searchTerm) || categoryName.includes(searchTerm);
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
  },
  methods: {
    getCategories() {
      this.token = localStorage.getItem("token");
      axios
        .get(`${config.apiBaseURL}/categories`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    },
    getProducts() {
      this.token = localStorage.getItem("token");
      axios
        .get(`${config.apiBaseURL}/products`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((response) => {
          // Store the products with category details
          this.products = response.data;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
    showAddModal() {
      this.newProductCode = "";
      this.newProductName = "";
      this.newProductBrand = "";
      this.newProduct = "";
      this.newProductSize = "";
      this.newProductPrice = "";
      this.newProductQty = "";
      this.newProductCategoryId = "";
      this.showAddProductModal = true;
    },
    closeAddModal() {
      this.showAddProductModal = false;
    },
    addProduct() {
      if (!this.newProductCategoryId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select a valid category.',
        });
        return;
      }

      axios
        .post(
          `${config.apiBaseURL}/products`,
          {
            product_code: this.newProductCode,
            name: this.newProductName,
            brand: this.newProductBrand,
            product_name: this.newProduct,
            size: this.newProductSize,
            price: parseFloat(this.newProductPrice),
            qty: parseInt(this.newProductQty, 10),
            category_id: parseInt(this.newProductCategoryId, 10),
          },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product added successfully!',
          });
          this.getProducts();
          this.closeAddModal();
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error adding product: ${error.response?.data?.message || 'Unknown error'}`,
          });
        });
    },
    // Show Edit Product Modal
    showEditModal(product) {
      this.currentProduct = { ...product };
      this.showModal = true;
    },
    // Close Edit Product Modal
    closeModal() {
      this.showModal = false;
    },
    // Update an existing product
    updateProduct() {
      const { id, product_code, name, brand, product_name, size, price, qty, category_id } = this.currentProduct;

      axios
        .put(
          `${config.apiBaseURL}/products/${id}`,
          {
            product_code,
            name,
            brand,
            product_name,
            size,
            price: parseFloat(price),
            qty: parseInt(qty, 10),
            category_id: parseInt(category_id, 10),
          },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product updated successfully!',
          });
          this.getProducts();
          this.closeModal();
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error updating product: ${error.response?.data?.message || 'Unknown error'}`,
          });
        });
    },
    // Delete a product
    deleteProduct(productId) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${config.apiBaseURL}/products/${productId}`, {
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Product deleted successfully!',
              });
              this.getProducts();
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error deleting product: ${error.response?.data?.message || 'Unknown error'}`,
              });
            });
        }
      });
    },
    // Change pagination page
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },
  mounted() {
    this.getCategories();
    this.getProducts();
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

th{
  color: purple;
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

/* Add Product Button */
.add-product-btn {
  border-radius: 25px;
  font-size: 16px;
  padding: 10px 20px;
  background-color: purple; /* Soft pastel purple */
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-product-btn:hover {
  background-color: #e0b8f2; /* Slightly lighter shade on hover */
  transform: translateY(-2px);
}

.add-product-btn:focus {
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
  border-color: #e0b8f2;
}

.modal-body input:focus,
.modal-body select:focus {
  outline: none;
  border-color: purple;
  box-shadow: 0 0 8px rgba(145, 2, 177, 0.5);
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
  background-color: rgb(220, 126, 220);
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
