import { PatientType } from "../patient";
import { DoctorType } from "../staff";

export type AppointmentType = {
  id: string;
  description: string;
  appointmentTime: Date;
  doctorId: string;
  patientId: string;
  doctor: DoctorType;
  patient: PatientType;
  status: string;
};
