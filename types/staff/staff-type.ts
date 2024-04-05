import { JobType } from ".";
import { AppUserType } from "../shared";

export type StaffType = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  address: string;
  appUser: AppUserType;
  job: JobType;
  staffID: string;
};

