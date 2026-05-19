export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'dokter' | 'pasien';
  phone: string | null;
  avatar: string | null;
  created_at: string;
}

export interface Patient {
  id: number;
  nik: string;
  full_name: string;
  gender: 'M' | 'F';
  birth_date: string;
  blood_type: 'A' | 'B' | 'AB' | 'O' | null;
  address: string;
  phone: string;
  emergency_contact: string | null;
  photo_ktp: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Polyclinic {
  id: number;
  name: string;
  code: string;
  description: string | null;
  floor: string | null;
  is_active: boolean;
}

export interface Doctor {
  id: number;
  nip: string;
  full_name: string;
  specialization: string;
  polyclinic: number;
  polyclinic_name?: string;
  phone: string;
  email: string | null;
  schedule_day: string;
  schedule_start: string;
  schedule_end: string;
  quota: number;
  is_active: boolean;
}

export interface Medicine {
  id: number;
  code: string;
  name: string;
  generic_name: string | null;
  category: string;
  unit: string;
  stock: number;
  min_stock: number;
  price: string;
  is_active: boolean;
  is_low_stock: boolean;
}

export interface MedicalRecord {
  id: number;
  record_number: string;
  patient: number;
  patient_name?: string;
  doctor: number;
  doctor_name?: string;
  polyclinic_name?: string;
  visit_date: string;
  complaint: string;
  diagnosis: string | null;
  notes: string | null;
  blood_pressure: string | null;
  weight: string | null;
  height: string | null;
  temperature: string | null;
  status: 'waiting' | 'in_progress' | 'done' | 'cancelled';
  created_at: string;
}

export interface PrescriptionDetail {
  id: number;
  medicine: number;
  medicine_detail?: Medicine;
  quantity: number;
  dosage: string;
  instructions: string;
}

export interface Prescription {
  id: number;
  medical_record: number;
  record_number?: string;
  patient_name?: string;
  doctor_name?: string;
  details: PrescriptionDetail[];
  notes: string | null;
  status: 'pending' | 'dispensed' | 'cancelled';
  dispensed_at: string | null;
  created_at: string;
}

export interface Report {
  id: number;
  title: string;
  report_type: 'visit' | 'medicine' | 'patient' | 'diagnosis';
  format: 'pdf' | 'xlsx';
  date_from: string;
  date_to: string;
  generated_by: number;
  generated_by_name?: string;
  file: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}