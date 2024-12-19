<template>
<div class="orders-section card shadow-sm p-4 mb-4">
    <h1 class="section-title">Most Purchased Products</h1>
    <div>
      <label for="interval" class="interval-label">Select Interval:</label>
      <select v-model="selectedInterval" @change="getOrders" class="form-select interval-select">
        <option value="day">Daily</option>
        <option value="month">Monthly</option>
        <option value="year">Yearly</option>
      </select>
    </div>

    <!-- Chart Canvas -->
    <canvas id="productsChart" width="400" height="200"></canvas>
</div>
</template>

<script>
import axios from "axios";
import config from "@/config";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      token: "",
      orders: [],
      products: [],
      productsMap: {}, // To map product_id to product name
      productsChart: null,
      selectedInterval: "day", // Default interval
    };
  },
  methods: {
    // Fetch orders data
    getOrders() {
      this.token = localStorage.getItem("token");

      axios
        .get(`${config.apiBaseURL}/orders`, {
          headers: { Authorization: "Bearer " + this.token },
        })
        .then((response) => {
          this.orders = response.data || [];
          this.getProducts(); // Fetch products after orders
        })
        .catch((error) => console.log(error));
    },

    // Fetch products data
    getProducts() {
      axios
        .get(`${config.apiBaseURL}/products`, {
          headers: { Authorization: "Bearer " + this.token },
        })
        .then((response) => {
          this.products = response.data || [];
          this.createProductsMap();
          this.processChartData();
        })
        .catch((error) => console.log(error));
    },

    // Map product_id to product name
    createProductsMap() {
      this.productsMap = {};
      this.products.forEach((product) => {
        this.productsMap[product.id] = product.name; // Store product_id -> product_name mapping
      });
    },

    // Process data for the chart
    processChartData() {
      const chartData = {};

      // Aggregate orders by selected interval and product name
      this.orders.forEach((order) => {
        const date = new Date(order.created_at);
        let period;

        if (this.selectedInterval === "day") {
          period = date.toISOString().split("T")[0]; // YYYY-MM-DD
        } else if (this.selectedInterval === "month") {
          period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
        } else if (this.selectedInterval === "year") {
          period = date.getFullYear().toString(); // YYYY
        }

        const productName = this.productsMap[order.product_id] || `Unknown Product`;
        const key = `${period} - ${productName}`;

        if (!chartData[key]) {
          chartData[key] = 0;
        }
        chartData[key] += order.qty; // Sum quantities
      });

      // Prepare data for the chart
      const labels = Object.keys(chartData);
      const values = Object.values(chartData);

      // Update the chart
      this.updateChart(labels, values);
    },

    // Render Chart.js graph
    updateChart(labels, values) {
      const ctx = document.getElementById("productsChart").getContext("2d");

      if (this.productsChart) {
        this.productsChart.destroy(); // Destroy previous chart instance
      }

      this.productsChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Most Purchased Products",
              data: values,
              backgroundColor: "#f5e1fd",
              borderColor: "purple",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Total Quantity",
              },
            },
            x: {
              title: {
                display: true,
                text: "Period & Product Name",
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.getOrders(); // Fetch orders on page load
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

