<template>
<div class="orders-section card shadow-sm p-4 mb-4">
    <h3 class="section-title">Stocks</h3>
    
    <canvas id="stockChart"></canvas>
  </div>
</template>
<script>
import { Chart, registerables } from "chart.js";
import config from '@/config';
import axios from "axios";
Chart.register(...registerables);

export default {
  data() {
    return {
      products: [], // List of products
      chartInstance: null, // Holds the Chart.js instance
      // Existing state data...
    };
  },
  methods: {
    getProducts() {
      this.token = localStorage.getItem("token");
      axios
        .get(`${config.apiBaseURL}/products`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((response) => {
          this.products = response.data;
          this.renderStockChart(); // Update chart after fetching products
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
    renderStockChart() {
      const ctx = document.getElementById("stockChart");

      // Destroy existing chart instance to prevent duplicates
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Prepare chart data
      const labels = this.products.map((product) => product.name);
      const quantities = this.products.map((product) => product.qty);

      // Create a new bar chart
      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Stock Levels",
              data: quantities,
              backgroundColor: "#f5e1fd",
              borderColor: "purple",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Quantity" },
            },
            x: {
              title: { display: true, text: "Product Name" },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

<style scoped>
.dashboard-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

.orders-section {
  border-radius: 10px;
  padding: 30px;
  background-color: #ffffff;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 15px;
  text-align: left;
  color: purple;
}

.date-range-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.date-label {
  font-size: 1rem;
}

.date-picker {
  font-size: 1rem;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.interval-label {
  font-size: 1rem;
  margin-right: 10px;
}

.interval-select {
  width: 150px;
  font-size: 1rem;
}

.total-earnings {
  font-size: 1.2rem;
  margin-top: 10px;
  color: purple;
}

.chart {
  width: 100%;
  height: 100px;
}

.card {
  border: 1;
  border-radius: 12px;
  align-items: center;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.forecast-description {
  font-size: 1rem;
  color: #666;
}
</style>