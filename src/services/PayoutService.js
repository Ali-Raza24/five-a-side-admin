import ApiService from './ApiService';
import axios from "axios";

export default class PayoutService extends ApiService {
    getPayoutRequests(per_page = 5, page = 1, search = '') {
        return axios.get(this.baseUrl + `payout-requests?page=${page}&per_page=${per_page}&search=${search}`);
    }

    getUserPayoutRequests(per_page = 5, page = 1) {
        return axios.get(this.baseUrl + `manager-payout-requests?page=${page}&per_page=${per_page}`);
    }

    getUserRequestHistory(per_page = 5, page = 1) {
        return axios.get(this.baseUrl + `manager-payout-requests-history?page=${page}&per_page=${per_page}`);
    }

    getAdminRequestHistory(per_page = 5, page = 1) {
        return axios.get(this.baseUrl + `admin-payout-requests-history?page=${page}&per_page=${per_page}`);
    }

    acceptPayoutRequest(payoutRequest) {
        return axios.patch(this.baseUrl + `payout-requests/${payoutRequest}/approve`)
    }

    declinePayoutRequest(payoutRequest, reason) {
        return axios.patch(this.baseUrl + `payout-requests/${payoutRequest}/decline`, {reason})
    }

    createPayoutRequest(amount, status = 'pending') {
        return axios.post(this.baseUrl + `payout-requests-create`, {amount, status});
    }
}