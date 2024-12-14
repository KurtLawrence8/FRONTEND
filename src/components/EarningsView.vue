<template>
    <h1>Earnings</h1>

    <table>
        <tr>
            <th>Quantity</th>
            <th>Cash</th>
        </tr>
        <tr>
            <td>{{ qty }}</td>
            <td>{{ cash }}</td>
        </tr>
    </table>
</template>

<script>
import axios from 'axios';
import config from '@/config';

export default{
    data(){
        return{
            qty: "",
            cash: "", 
        }
    },
    methods: {
        getOrders(){
            axios.get(`${config.apiBaseURL}/orders`, {
                headers: { Authorization: 'Bearer ' + this.token },
                qty: this.qty,
                cash: this.data.cash,
            })
            .then((response) => {
                this.qty = response.data.qty.toString();
                this.cash = response.data.cash.toString();
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>