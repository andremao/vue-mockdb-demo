import axios from 'axios';
import Vue from 'vue';

const request = axios.create({
  baseURL: 'http://localhost:8080',
});

Vue.prototype.$request = request;
