import { baseApiUrl } from "@/config";
import { APIResponseType } from "@/types/shared";
import axios from "axios";

class AuthService {
  async LoginPatient(data: { email: string; password: string }) {
    const response = await axios.post<APIResponseType<{ token: string }>>(
      `${baseApiUrl}/AppUser/LoginPatientUser`,
      data
    );
    return response?.data;
  }
  async LoginStaff(data: { email: string; password: string }) {
    const response = await axios.post<APIResponseType<{ token: string }>>(
      `${baseApiUrl}/AppUser/LoginStaffUser`,
      data
    );
    return response?.data;
  }
}

export const authService = new AuthService();
