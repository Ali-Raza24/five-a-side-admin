import ApiService from './ApiService';
import axios from 'axios';

export default class VenueService extends ApiService {


  create(data) {
    return axios.post(this.baseUrl + `venues`, data);
  }

  show(venueID) {
    return axios.get(this.baseUrl + `venues/${venueID}`);
  }

  update(data, venueID) {
    return axios.patch(this.baseUrl + `venues/${venueID}`, data);
  }

  delete(venueID) {
    return axios.delete(this.baseUrl + `venues/${venueID}`);
  }

  getAllVenues(per_page = 5, page = 1, search = '') {
    return axios.get(this.baseUrl + `venues?page=${page}&per_page=${per_page}&search=${search}`);
  }

  getVenuePitches(venueId) {
    return axios.get(this.baseUrl + `venues/${venueId}/pitches`);
  }

  getVenueManagerVenues() {
    return axios.get(this.baseUrl + `venues/manager-venues`);
  }

  createPitch(venueId, data) {
    return axios.post(this.baseUrl + `venues/${venueId}/pitches`, data);
  }

  showPitch(venueId, pitchId) {
    return axios.get(this.baseUrl + `venues/${venueId}/pitches/${pitchId}`);
  }

  updatePitch(data, venueID, pitchId) {
    return axios.put(this.baseUrl + `venues/${venueID}/pitches/${pitchId}`, data);
  }

  deletePitch(venueId, pitchId) {
    return axios.delete(this.baseUrl + `venues/${venueId}/pitches/${pitchId}`);
  }

  getPitchBookings(pitchId, data) {
    return axios.post(this.baseUrl + `manager-pitch-bookings/${pitchId}`, {data})
  }

  getCalendarVenues() {
    return axios.get(this.baseUrl + `venues/calendar-venues`);
  }
}