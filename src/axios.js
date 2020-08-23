import axios from "axios";

const instance = axios.create({
  baseURL: "https://disease.sh",
});

export default instance;
