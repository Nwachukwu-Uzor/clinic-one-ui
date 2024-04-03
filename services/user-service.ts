import { baseApiUrl } from "@/config";
import { PatientType } from "@/types/patient";
import { APIResponseType } from "@/types/shared";
import axios from "axios";

class UserService {
  async getProfileByUserId(token: string) {
    const response = await axios.get<APIResponseType<PatientType>>(
      `${baseApiUrl}/Patients/GetPatientDetailsByAppUserIdD`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response?.data;
  }
}

export const userService = new UserService();
