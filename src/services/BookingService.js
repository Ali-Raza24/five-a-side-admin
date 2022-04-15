import ApiService from './ApiService';
import axios from "axios";

export default class BookingService extends ApiService {
  getAdminBookings(per_page = 5, page = 1) {
    return axios.get(this.baseUrl + `admin-bookings?page=${page}&per_page=${per_page}`);
  }

  getAllBookings() {
    return axios.get(this.baseUrl + `manager-bookings`);
  }

  getHoursForTheDay(pitch, date) {
    return axios.post(this.baseUrl + `booking/${pitch}`, {date});
  }

  bookPitch(pitch, bookings, description) {
    return axios.post(this.baseUrl + `pitches/${pitch}/bookings`, {bookings, description});
  }

  blockBooking(data) {
    return axios.post(this.baseUrl + `block-booking`, data);
  }

  updateBooking(booking, pitch, bookings, description) {
    return axios.patch(this.baseUrl + `pitches/${pitch}/bookings/${booking}`, {bookings, description});
  }

  editBlockBooking(bookingId, data) {
    return axios.patch(this.baseUrl + `block-booking/${bookingId}`, data);
  }

  deleteBlockBooking(bookingId) {
    return axios.delete(this.baseUrl + `block-booking/${bookingId}`)
  }

  deleteBooking(booking, pitch) {
    return axios.delete(this.baseUrl + `pitches/${pitch}/bookings/${booking}`);
  }

  cancelBooking(bookingId) {
    return axios.post(this.baseUrl + `bookings/${bookingId}/cancel`);
  }
}
