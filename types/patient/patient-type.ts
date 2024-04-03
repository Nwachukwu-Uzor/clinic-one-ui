import { AppUserType } from "../shared";

export type PatientType = {
  id: string;
  patientID: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  address: string;
  genotype: string;
  bloodGroup: string;
  phoneNumber: string;
  country: string;
  appUser: AppUserType;
};
