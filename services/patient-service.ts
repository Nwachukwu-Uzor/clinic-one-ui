import { baseApiUrl } from "@/config";
import { PatientType } from "@/types/patient";
import { APIResponseType, PaginatedResponseType } from "@/types/shared";
import axios from "axios";

export class PatientService {
  private _accessHeader: string;

  constructor(accessToken: string | null) {
    if (!accessToken) {
      throw new Error("Please provide a valid access token");
    }
    this._accessHeader = `Bearer ${accessToken}`;
  }

  async getPatientList(page: number, pageSize = 30) {
    const response = await axios.get<
      APIResponseType<PaginatedResponseType<PatientType>>
    >(
      `${baseApiUrl}/Patients/GetPatientsPaginated?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );

    return response.data.data;
  }

  async getPatientByPatientID(patientID: string) {
    const response = await axios.get<APIResponseType<PatientType>>(
      `${baseApiUrl}/Patients/GetPatientDetailsByPatientID/${patientID}`,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );
    return response.data;
  }
}
