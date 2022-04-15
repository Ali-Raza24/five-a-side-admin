import ApiService from './ApiService';
import axios from "axios";

export default class TokenService extends ApiService {

    getUserTokens(userId) {
        return axios.get(this.baseUrl + `users/${userId}/tokens`);
    }

    getTokenPurchases(per_page = 5, page = 1, search = '') {
        return axios.get(this.baseUrl + `token-purchase-history?page=${page}&per_page=${per_page}&search=${search}`);
    }
}