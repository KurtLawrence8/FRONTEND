<template>
  <div class="container my-5">
    <h1 class="text-center mb-4">Order Management</h1>

    <!-- Product Scanning -->
    <div class="mb-4">
      <div class="input-group">
        <input 
          v-model="productCode" 
          type="text" 
          class="form-control"
          placeholder="Enter Product Code"
          @keyup.enter="scanProduct" 
        />
        <button class="btn btn-primary" @click="scanProduct">Scan Product</button>
      </div>
    </div>

    <!-- Scanned Product Display -->
    <div v-if="scannedProduct" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Product Details</h5>
        <p class="card-text"><strong>Name:</strong> {{ scannedProduct.name }}</p>
        <p class="card-text"><strong>Price:</strong> ₱{{ scannedProduct.price }}</p>
        <p class="card-text"><strong>Quantity:</strong> {{ scannedProduct.qty }}</p>
        <button class="btn btn-success" @click="addProductToOrder">Add to Order</button>
      </div>
    </div>

    <!-- Order List -->
    <div v-if="orderList.length" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Your Order</h5>
        <ul class="list-group">
          <li v-for="(order, index) in orderList" :key="index" class="list-group-item">
            {{ order.name }} - ₱{{ order.price }} x {{ order.qty }}
          </li>
        </ul>
        <p class="fw-bold mt-3">Total: ₱{{ totalPrice }}</p>
        <button class="btn btn-warning" @click="payProduct">Proceed to Payment</button>
      </div>
    </div>

    <!-- Payment Section -->
    <div v-if="showPayment" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Payment</h5>
        <div class="mb-3">
          <input 
            v-model="cashAmount" 
            type="number" 
            class="form-control" 
            placeholder="Enter Cash Amount" 
            min="0" 
          />
        </div>
        <button class="btn btn-success" @click="processPayment">Pay</button>
        <div v-if="paymentStatus" :class="paymentStatus.success ? 'alert alert-success mt-3' : 'alert alert-danger mt-3'">
          <p>{{ paymentStatus.message }}</p>
        </div>
      </div>
    </div>

    <!-- Receipt Section -->
    <div v-if="paymentStatus && paymentStatus.success" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Receipt</h5>
        <ul class="list-group">
          <li v-for="(order, index) in orderList" :key="index" class="list-group-item">
            {{ order.name }} - ₱{{ order.price }} x {{ order.qty }}
          </li>
        </ul>
        <p class="fw-bold mt-3">Total: ₱{{ totalPrice }}</p>
        <p>Cash Paid: ₱{{ cashAmount }}</p>
        <p>Change: ₱{{ cashAmount - totalPrice }}</p>
        <button class="btn btn-primary" @click="resetOrder">New Order</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';

export default {
  data() {
    return {
      productCode: '',
      scannedProduct: null,
      orderList: [],
      cashAmount: 0,
      showPayment: false,
      paymentStatus: null,
    };
  },
  computed: {
    totalPrice() {
      return this.orderList.reduce((sum, order) => sum + (order.price * order.qty), 0);
    }
  },
  methods: {
    async scanProduct() {
      this.token = localStorage.getItem('token');
      
      try {
        const response = await axios.post(`${config.apiBaseURL}/scan-product`, {
          product_code: this.productCode
        }, {
          headers: { Authorization: 'Bearer ' + this.token },
        });

        if (response.data.order) {
          this.scannedProduct = response.data.order;
        }
      } catch (error) {
        console.error("Error scanning product", error);
        alert('Product not available or out of stock');
      }
    },
    addProductToOrder() {
      const existingProduct = this.orderList.find(order => order.product_id === this.scannedProduct.product_id);
      
      if (existingProduct) {
        existingProduct.qty += 1;
      } else {
        this.orderList.push({ ...this.scannedProduct });
      }

      this.scannedProduct = null;
      this.productCode = '';
    },
    async payProduct() {
      this.showPayment = true;
    },
    async processPayment() {
      const total = this.totalPrice;
      
      if (this.cashAmount < total) {
        this.paymentStatus = { success: false, message: 'Insufficient cash' };
        return;
      }

      try {
        await axios.post(`${config.apiBaseURL}/pay`, {
          cash: this.cashAmount,
          orders: this.orderList
        }, {
          headers: { Authorization: 'Bearer ' + this.token },
        });

        this.paymentStatus = { success: true, message: `Payment successful. Change: ₱${this.cashAmount - total}` };
      } catch (error) {
        console.error("Error processing payment", error);
        this.paymentStatus = { success: false, message: 'Error processing payment' };
      }
    },
    resetOrder() {
      this.orderList = [];
      this.cashAmount = 0;
      this.paymentStatus = null;
      this.showPayment = false;
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
}

.card-body {
  padding: 1.5rem;
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  width: 100%;
}

h1 {
  color: #5F4B8B;
}

.fw-bold {
  font-weight: bold;
}

.alert {
  font-size: 1rem;
}

input[type="number"] {
  font-size: 1rem;
}

input, button {
  font-size: 1rem;
}

</style>
