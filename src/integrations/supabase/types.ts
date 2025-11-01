export type VehicleStatus = "available" | "in_use" | "maintenance" | "out_of_service";

export interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  vehicle_type: "truck" | "van" | "trailer";
  fuel_type: "diesel" | "gasoline" | "electric" | "hybrid";
  status: VehicleStatus;
  consumption_mixed: number | null;
  current_km: number;
  created_at: string;
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  license_number: string;
  status: "available" | "on_trip" | "off_duty" | "unavailable";
  license_expiry: string;
}

export interface Trip {
  id: string;
  vehicle_id: string;
  driver_id: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string | null;
  distance_km: number | null;
  fuel_consumed_liters: number | null;
}

export interface Expense {
  id: string;
  vehicle_id: string | null;
  driver_id: string | null;
  trip_id: string | null;
  expense_type: string;
  amount: number;
  currency: string;
  date: string;
  description: string | null;
}
