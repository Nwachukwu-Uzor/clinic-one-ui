import { baseApiUrl } from "@/config";
import { APIResponseType, PaginatedResponseType } from "@/types/shared";
import { DepartmentType, JobType } from "@/types/staff";
import { StaffType } from "@/types/staff/staff-type";
import axios from "axios";

export class StaffService {
  private _accessHeader: string;

  constructor(accessToken: string | null) {
    if (!accessToken) {
      throw new Error("Please provide a valid access token");
    }
    this._accessHeader = `Bearer ${accessToken}`;
  }

  async getStaffList(page: number, pageSize = 30) {
    const response = await axios.get<
      APIResponseType<PaginatedResponseType<StaffType>>
    >(
      `${baseApiUrl}/Staff/GetStaffPaginated?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );

    return response.data.data;
  }

  async getAllDepartments() {
    const response = await axios.get<APIResponseType<DepartmentType[]>>(
      `${baseApiUrl}/Departments/GetAll`,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );
    return response.data;
  }

  async getJobForDepartment(departmentId: string) {
    const response = await axios.get<APIResponseType<JobType[]>>(
      `${baseApiUrl}/Departments/GetAllJobsByDepartmentId/${departmentId}`,
      {
        headers: {
          Authorization: this._accessHeader,
        },
      }
    );
    return response.data;
  }
}
