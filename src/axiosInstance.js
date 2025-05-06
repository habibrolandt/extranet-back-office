import axios from "axios";
import { rootUrl } from "./services/apiService";

const axiosInstance = axios.create({
    baseURL: rootUrl, // Remplacez par votre URL de base
});

export default axiosInstance;
