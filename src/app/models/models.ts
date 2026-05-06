export interface QuantityDTO {
  value: number;
  unit: string;
  measurementType: string;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO?: QuantityDTO;
}

export interface QuantityMeasurementResult {
  id?: number;
  thisValue: number;
  thisUnit: string;
  thisMeasurementType: string;
  thatValue?: number;
  thatUnit?: string;
  thatMeasurementType?: string;
  operation: string;
  resultValue?: number;
  resultUnit?: string;
  resultString?: string;
  error: boolean;
  errorMessage?: string;
  createdAt?: string;
}
 
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email?: string;
  name?: string;
}

export const UNITS_BY_TYPE: Record<string, string[]> = {
  LENGTH: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WEIGHT: ['KILOGRAM', 'GRAM', 'POUND'],
  VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT']
};

export const MEASUREMENT_TYPES = ['LENGTH', 'WEIGHT', 'VOLUME', 'TEMPERATURE'];

export const OPERATIONS = [
  { key: 'convert', label: 'Convert', icon: '⇄', supportsThat: true },
  { key: 'compare', label: 'Compare', icon: '≈', supportsThat: true },
  { key: 'add', label: 'Add', icon: '+', supportsThat: true },
  { key: 'subtract', label: 'Subtract', icon: '−', supportsThat: true },
  { key: 'divide', label: 'Divide', icon: '÷', supportsThat: true }
];
