<template>
  <h1>Dashboard</h1>

  <div class="dashboard-container">

    <div class="cards-container">
      <div class="card">
        <h3>Total Users</h3>
        <p>{{ totalUsers }}</p>
      </div>
      <div class="card">
        <h3>Total Products</h3>
        <p>{{ totalProducts }}</p>
      </div>
      <div class="card">
        <h3>Total Categories</h3>
        <p>{{ totalCategories }}</p>
      </div>
      <div class="card">
        <h3>Total Orders</h3>
        <p>{{ totalOrders }}</p>
      </div>
      <div class="card">
        <h3>Mean Quantity</h3>
        <p>{{ meanQty }}</p>
      </div>
      <div class="card">
        <h3>Median Quantity</h3>
        <p>{{ medianQty }}</p>
      </div>
      <div class="card">
        <h3>Mode Quantity</h3>
        <p>{{ modeQty }}</p>
      </div>
      <div class="card">
        <h3>Total Sales</h3>
        <p>{{ formatCurrency(totalEarnings) }}</p>
      </div>
    </div>
      <ForecastingView/>
  </div>
</template>

<script>
import axios from 'axios';
import ForecastingView from './ForecastingView.vue';
import config from '@/config';

export default {
  components: { ForecastingView },
  data() {
    return {
      token: "",
      totalProducts: 0,
      totalCategories: 0, 
      totalOrders: 0,
      totalUsers: 0,
      totalEarnings: 0,
      meanQty: 0,
      medianQty: 0,
      modeQty: "None",
    };
  },
  methods: {
    getProduct() {
      this.token = localStorage.getItem('token');

      axios.get(`${config.apiBaseURL}/products`, {
        headers: { Authorization: 'Bearer ' + this.token },
      })
      .then((response) => {
        this.totalProducts = response.data ? response.data.length : 0;
      })
      .catch((error) => console.log(error));
    },
    getUser() {
      this.token = localStorage.getItem('token');

      axios.get(`${config.apiBaseURL}/users`, {
        headers: { Authorization: 'Bearer ' + this.token },
      })
      .then((response) => {
        this.totalUsers = response.data ? response.data.length : 0;
      })
      .catch((error) => console.log(error));
    },
    getCategory() {
      this.token = localStorage.getItem('token');

      axios.get(`${config.apiBaseURL}/categories`, {
        headers: { Authorization: 'Bearer ' + this.token },
      })
      .then((response) => {
        this.totalCategories = response.data ? response.data.length : 0;
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
    calculateEarnings(orders) {
      this.totalEarnings = orders.reduce((acc, order) => acc + parseFloat(order.cash || 0), 0);
    },
    calculateStatistics(orders) {
      const quantities = orders.map(order => order.qty);

      // Mean
      const mean = quantities.reduce((sum, qty) => sum + qty, 0) / quantities.length;

      // Median
      quantities.sort((a, b) => a - b);
      const mid = Math.floor(quantities.length / 2);
      const median = quantities.length % 2 === 0
        ? (quantities[mid - 1] + quantities[mid]) / 2
        : quantities[mid];

      // Mode
      const frequency = {};
      quantities.forEach(qty => {
        frequency[qty] = (frequency[qty] || 0) + 1;
      });
      const maxFreq = Math.max(...Object.values(frequency));
      const mode = Object.keys(frequency)
        .filter(qty => frequency[qty] === maxFreq)
        .map(Number);

      return { mean, median, mode };
    },
    formatCurrency(amount) {
      return amount.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
    },
  },
  mounted() {
    this.getUser();
    this.getCategory();
    this.getOrders();
    this.getProduct();
  },
};
</script>

<style scoped>
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

.dashboard-container {
  display: flex;
  flex-direction: column; /* Stack cards and graph vertically */
  gap: 20px;
  padding: 10px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Responsive columns */
  gap: 15px;
  width: 100%;
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card h3 {
  font-size: 1.0rem; /* Scales dynamically with root font size */
  margin-bottom: 10px;
  color: #333;
}

.card p {
  font-size: 1.0rem; /* Scales dynamically with root font size */
  color: purple;
  font-weight: bold;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr); 
  }

  .card h3 {
    font-size: 1.1rem; /* Slightly smaller on medium screens */
  }

  .card p {
    font-size: 1.4rem; /* Slightly smaller on medium screens */
  }
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr; /* Stack cards vertically on small screens */
  }

  .dashboard-container {
    gap: 15px;
  }

  .card h3 {
    font-size: 1rem; /* Further reduced size for smaller screens */
  }

  .card p {
    font-size: 1.2rem; /* Further reduced size for smaller screens */
  }
}

</style>
