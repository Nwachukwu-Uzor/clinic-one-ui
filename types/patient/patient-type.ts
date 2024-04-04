import { AppUserType } from "../shared";

export type PatientType = {
  id: string;
  patientID: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  address: string;
  genotype: string;
  bloodGroup: string;
  phoneNumber: string;
  country: string;
  appUser: AppUserType;
};
