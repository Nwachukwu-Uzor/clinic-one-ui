import { JobType } from ".";
import { AppUserType } from "../shared";

export type StaffType = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  address: string;
  appUser: AppUserType;
  job: JobType;
  staffID: string;
  country: string;
  phoneNumber: string;
};
