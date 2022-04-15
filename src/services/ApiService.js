import config from "../config";
import axios from "axios";

export default class ApiService {
  // Load config
  constructor() {
    this.token = localStorage.getItem("token");
    this.baseUrl = config.ROOT_URL;
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    //  Set default headers
    if (this.token) {
      axios.defaults.headers = {
        Authorization: `Bearer ${this.token}`,
      };
    }
  }
}
