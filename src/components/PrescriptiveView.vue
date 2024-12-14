<template>
    <div>
      <!-- Content remains the same, no modal needed -->
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2'; // Import SweetAlert2
  import config from '@/config';
  
  export default {
    data() {
      return {
        totalProducts: 0,
        totalOrders: 0,
        meanQty: 0,
        medianQty: 0,
        modeQty: "None",
        products: [] // Store the fetched product data
      };
    },
    methods: {
      getProduct() {
        this.token = localStorage.getItem('token');
  
        axios.get(`${config.apiBaseURL}/products`, {
          headers: { Authorization: 'Bearer ' + this.token },
        })
          .then((response) => {
            this.products = response.data || [];
            this.totalProducts = this.products.length;
            // Check product quantities after the data is fetched
            this.checkProductQuantities(this.products);
          })
          .catch((error) => console.log(error));
      },
      getOrders() {
        this.token = localStorage.getItem('token');
  
        axios.get(`${config.apiBaseURL}/orders`, {
          headers: { Authorization: 'Bearer ' + this.token },
        })
          .then((response) => {
            if (response.data && Array.isArray(response.data)) {
              this.totalOrders = response.data.length;
              this.calculateEarnings(response.data);
              const stats = this.calculateStatistics(response.data);
              this.meanQty = stats.mean.toFixed(2);
              this.medianQty = stats.median;
              this.modeQty = stats.mode.join(", ");
            } else {
              this.totalOrders = 0;
              this.meanQty = 0;
              this.medianQty = 0;
              this.modeQty = "None";
            }
          })
          .catch((error) => console.log(error));
      },
      checkProductQuantities(products) {
        // Loop through the products and check their quantities
        products.forEach(product => {
          if (product.qty <= 10) {
            this.showAlert(`Danger: The quantity of ${product.name} is below 10!`, 'error');
          } else if (product.qty <= 20) {
            this.showAlert(`Warning: The quantity of ${product.name} is below 20!`, 'warning');
          }
        });
      },
      showAlert(message, icon) {
        Swal.fire({
          title: icon === 'error' ? 'Danger!' : 'Warning!',
          text: message,
          icon: icon,
          confirmButtonText: 'Okay',
          confirmButtonColor: '#3085d6',
          background: '#fff',
          padding: '20px',
          customClass: {
            popup: 'sweetalert-popup',
          }
        });
      },
      calculateEarnings() {
        // Add your earnings calculation logic here
      },
      calculateStatistics() {
        // Add your statistics calculation logic here
        return { mean: 0, median: 0, mode: [] }; // Placeholder
      }
    },
    created() {
      // Fetch products and orders when the component is created
      this.getProduct();
      this.getOrders();
    }
  }
  </script>
  
  <style scoped>
  /* Optional: Add custom styles for SweetAlert2 if needed */
  .sweetalert-popup {
    border-radius: 8px; /* Add border-radius to SweetAlert2 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Add shadow for popup */
  }
  
  </style>
  