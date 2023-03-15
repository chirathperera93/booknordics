import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppConfig from "./AppConfig";

export const customAxios = axios.create({
  baseURL: AppConfig.ApiBaseURL,
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "User-Agent": "CommerceManagementApp",
    "Cenium-Tenant-Id": localStorage.getItem("Cenium-Tenant-Id"),
  },
});

customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(error);
    toast.error(`${error.message + "." + error.code}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
);

export default customAxios;
