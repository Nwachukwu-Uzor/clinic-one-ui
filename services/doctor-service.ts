import { baseApiUrl } from "@/config";
import { APIResponseType } from "@/types/shared";
import { DoctorType } from "@/types/staff";
import axios from "axios";

export class DoctorService {
  private _accessHeader: string;

  constructor(accessToken: string | null) {
    if (!accessToken) {
      throw new Error("Please provide a valid access token");
    }
    this._accessHeader = `Bearer ${accessToken}`;
  }

  async getAllDoctors() {
    const response = await axios.get<APIResponseType<DoctorType[]>>(
      `${baseApiUrl}/Doctors/GetAllDoctors`,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );
    return response.data;
  }
}
