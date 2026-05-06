import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityService, QuantityResult, MEASUREMENT_UNITS } from '../../services/quantity.service';

type Operation = 'convert' | 'compare' | 'add' | 'subtract' | 'divide';

const SINGLE_INPUT_OPS: Operation[] = ['convert'];

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  operation = signal<Operation>('convert');
  measurementType = signal<string>('LENGTH');
  value1 = signal<number>(1);
  unit1 = signal<string>('METER');
  value2 = signal<number>(1);
  unit2 = signal<string>('CENTIMETER');
  toUnit = signal<string>('CENTIMETER');

  result = signal<QuantityResult | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  measurementTypes = Object.keys(MEASUREMENT_UNITS);
  operations: { key: Operation; label: string; icon: string }[] = [
    { key: 'convert', label: 'Convert', icon: '⇄' },
    { key: 'compare', label: 'Compare', icon: '⚖' },
    { key: 'add', label: 'Add', icon: '+' },
    { key: 'subtract', label: 'Subtract', icon: '−' },
    { key: 'divide', label: 'Divide', icon: '÷' },
  ];

  isSingleInput = computed(() => SINGLE_INPUT_OPS.includes(this.operation()));

  get units(): string[] {
    return MEASUREMENT_UNITS[this.measurementType()] || [];
  }

  constructor(private svc: QuantityService) {}

  onMeasurementTypeChange(type: string): void {
    this.measurementType.set(type);
    const units = MEASUREMENT_UNITS[type];
    this.unit1.set(units[0]);
    this.unit2.set(units[1] || units[0]);
    this.toUnit.set(units[1] || units[0]);
    this.result.set(null);
  }

  onOperationChange(op: Operation): void {
    this.operation.set(op);
    this.result.set(null);
    this.error.set(null);
  }

  calculate(): void {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    const op = this.operation();
    const type = this.measurementType();

    const input = op === 'convert'
      ? {
          thisQuantityDTO: { value: this.value1(), unit: this.unit1(), measurementType: type },
          thatQuantityDTO: { value: 0, unit: this.toUnit(), measurementType: type }
        }
      : {
          thisQuantityDTO: { value: this.value1(), unit: this.unit1(), measurementType: type },
          thatQuantityDTO: { value: this.value2(), unit: this.unit2(), measurementType: type }
        };

    const call = this.svc[op](input);
    call.subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'An error occurred. Please try again.');
        this.loading.set(false);
      }
    });
  }

  formatUnit(u: string): string {
    return u.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
