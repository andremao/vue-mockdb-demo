import axios from 'axios';
import Vue from 'vue';

const request = axios.create({
  baseURL: 'http://localhost:8080/api',
});

Vue.prototype.$request = request;
