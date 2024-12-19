<template>
    <div class="orders-section card shadow-sm p-4 mb-4">
      <h2 class="section-title">Sales Forecast</h2>

      <div class="date-range-selector">
        <label for="from-date" class="date-label">From:</label>
        <input
          type="date"
          id="from-date"
          v-model="fromDate"
          class="date-picker"
          @change="updateOrdersGraph"
        />

        <label for="to-date" class="date-label">To:</label>
        <input
          type="date"
          id="to-date"
          v-model="toDate"
          class="date-picker"
          @change="updateOrdersGraph"
        />

        <label for="orders-interval" class="interval-label">Select Time Interval:</label>
        <select
          id="orders-interval"
          v-model="selectedOrdersInterval"
          @change="updateOrdersGraph"
          class="form-select interval-select"
        >
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>

      <div class="total-earnings">
        <strong>Total Sales: </strong>₱{{ totalEarnings.toFixed(2) }}
      </div>

      <canvas id="ordersChart" class="chart mt-4"></canvas>
    </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import config from '@/config';

Chart.register(...registerables);

export default {
  data() {
    return {
      token: '',
      orders: [],
      selectedOrdersInterval: 'day',
      fromDate: '',
      toDate: '',
      ordersChart: null,
      totalEarnings: 0, // Track total earnings
    };
  },
  methods: {
    getOrders() {
      this.token = localStorage.getItem('token');

      axios
        .get(`${config.apiBaseURL}/orders`, {
          headers: { Authorization: 'Bearer ' + this.token },
        })
        .then((response) => {
          this.orders = response.data || [];
          this.updateOrdersGraph();
        })
        .catch((error) => console.log(error));
    },
    groupDataByTime(data, key, interval) {
      const result = { labels: [], values: [] };
      const grouped = {};
      this.totalEarnings = 0; // Reset total earnings before calculation

      data.forEach((item) => {
        const date = new Date(item[key]);
        let label;

        switch (interval) {
          case 'day':
            label = date.toDateString();
            break;
          case 'month':
            label = `${date.getFullYear()}-${date.getMonth() + 1}`;
            break;
          case 'year':
            label = `${date.getFullYear()}`;
            break;
          default:
            label = date.toDateString();
            break;
        }

        grouped[label] = (grouped[label] || 0) + parseFloat(item.cash);
        this.totalEarnings += parseFloat(item.cash); // Add to total earnings
      });

      for (const [label, value] of Object.entries(grouped)) {
        result.labels.push(label);
        result.values.push(value);
      }

      return result;
    },
    forecastData(values, interval) {
      const forecasts = [];
      const lastValue = values[values.length - 1] || 0;

      if (interval === 'day') {
        for (let i = 1; i <= 3; i++) {
          const forecastDate = new Date();
          forecastDate.setDate(forecastDate.getDate() + i); // Add days for forecast
          forecasts.push({ value: lastValue + i * (lastValue * 0.05), date: forecastDate.toDateString() });
        }
      } else if (interval === 'month') {
        for (let i = 1; i <= 3; i++) {
          const forecastDate = new Date();
          forecastDate.setMonth(forecastDate.getMonth() + i); // Add months for forecast
          forecasts.push({ value: lastValue + i * (lastValue * 0.1), date: `${forecastDate.getFullYear()}-${forecastDate.getMonth() + 1}` });
        }
      } else if (interval === 'year') {
        for (let i = 1; i <= 3; i++) {
          const forecastDate = new Date();
          forecastDate.setFullYear(forecastDate.getFullYear() + i); // Add years for forecast
          forecasts.push({ value: lastValue + i * (lastValue * 0.15), date: `${forecastDate.getFullYear()}` });
        }
      }

      return forecasts;
    },
    updateOrdersGraph() {
      let filteredOrders = this.orders;

      if (this.fromDate && this.toDate) {
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= new Date(this.fromDate) && orderDate <= new Date(this.toDate);
        });
      }

      const ordersData = this.groupDataByTime(filteredOrders, 'created_at', this.selectedOrdersInterval);
      const forecastValues = this.forecastData(ordersData.values, this.selectedOrdersInterval);

      if (this.ordersChart) {
        this.ordersChart.destroy();
      }

      const labels = [...ordersData.labels, ...forecastValues.map(f => f.date)];
      const values = [...ordersData.values, ...forecastValues.map(f => f.value)];

      this.ordersChart = new Chart(document.getElementById('ordersChart'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Earnings (Cash)',
              data: ordersData.values,
              borderColor: 'purple',
              backgroundColor: '#f5e1fd',
              fill: true,
            },
            {
              label: 'Forecasted Earnings',
              data: values,
              borderColor: 'Orchid',
              backgroundColor: '#E6E6FA',
              fill: true,
              borderDash: [5, 5],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `₱${tooltipItem.raw.toFixed(2)}`;
                },
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.getOrders();
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
