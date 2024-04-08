import { baseApiUrl } from "@/config";
import { AppointmentType } from "@/types/appointment";
import { APIResponseType, PaginatedResponseType } from "@/types/shared";
import { StaffType } from "@/types/staff/staff-type";
import axios from "axios";

export class AppointmentService {
  private _accessHeader: string;

  constructor(accessToken: string | null) {
    if (!accessToken) {
      throw new Error("Please provide a valid access token");
    }
    this._accessHeader = `Bearer ${accessToken}`;
  }

  async getUpcomingAppointmentsList(page: number, pageSize = 30) {
    const response = await axios.get<
      APIResponseType<PaginatedResponseType<AppointmentType>>
    >(
      `${baseApiUrl}/Appointments/GetUpcomingAppointmentsPaginated?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );

    return response.data.data;
  }

  async creatAnAppointment(data: {
    doctorId: string;
    patientId: string;
    appointmentTime: Date;
    description?: string;
  }) {
    const response = await axios.post<APIResponseType<string>>(
      `${baseApiUrl}/Appointments/CreateAppointment`,
      data,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );
    return response.data;
  }
}
