import ApiService from "./ApiService";
import axios from "axios";

export default class AuthService extends ApiService {
  me() {
    return axios.get(this.baseUrl + `auth/user`);
  }

  async login(email, password) {
    return await axios.post(this.baseUrl + "auth/login", { email, password });
  }
}
