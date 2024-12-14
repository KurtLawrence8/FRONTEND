<template>
  <h1>Inventory</h1>
  <div class="container mt-4">
    <!-- Search and Add Product Button -->
    <div class="d-flex justify-content-end mb-4">
      <input
        type="text"
        class="form-control search-bar"
        v-model="searchQuery"
        placeholder="Search products"
      />
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedProducts" :key="product.id">
            <td>{{ (currentPage - 1) * itemsPerPage + (index + 1) }}</td>
            <td>{{ product.category ? product.category.name : 'No Category' }}</td>
            <td>{{ product.product_code }}</td>
            <td>{{ product.brand }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.size }}</td>
            <td>₱ {{ product.price }}</td>
            <td>{{ product.qty }} pc/s</td>
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
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";

export default {
  data() {
    return {
      products: [],
      categories: [],
      token: "",
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const productName = product.name.toLowerCase();
        const productNumber = product.product_code.toLowerCase();
        const categoryName = product.category ? product.category.name.toLowerCase() : "";
        const searchTerm = this.searchQuery.toLowerCase();
        return (
          productName.includes(searchTerm) ||
          categoryName.includes(searchTerm) ||
          productNumber.includes(searchTerm)
        );
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
          this.products = response.data;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
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
  
  /* Buttons */
  .btn {
    border-radius: 25px;
    padding: 8px 15px;
    font-size: 14px;
    transition: background-color 0.3s ease;
  }
  
  .btn-secondary {
    background-color: #f1f1f1;
    color: #555;
  }
  
  .btn-primary {
    background-color: #e0b8f2;
    color: white;
    border-color: #e0b8f2;
  }
  
  .btn-secondary:hover {
    background-color: #ddd;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
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

  .table th{
    color: purple;;
  }
  
  thead {
    background-color: #f8f9fa;
    font-weight: bold;
  }
  
  tbody tr:hover {
    background-color: #f1f1f1;
  }
  </style>
  