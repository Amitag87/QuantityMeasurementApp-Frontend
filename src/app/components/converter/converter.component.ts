import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityService } from '../../services/quantity.service';
import {
  MEASUREMENT_TYPES, UNITS_BY_TYPE, OPERATIONS,
  QuantityMeasurementResult, QuantityInputDTO
} from '../../models/models';
import { OpIconPipe } from '../../pipes/op-icon.pipe';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, OpIconPipe],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {
  measurementTypes = MEASUREMENT_TYPES;
  operations = OPERATIONS;
  unitsMap = UNITS_BY_TYPE;

  selectedOp = 'convert';
  selectedType = 'LENGTH';
  value1 = 1;
  unit1 = 'FEET';
  value2 = 1;
  unit2 = 'INCHES';
  toUnit = 'INCHES';

  result: QuantityMeasurementResult | null = null;
  loading = false;
  error = '';

  get availableUnits(): string[] {
    return this.unitsMap[this.selectedType] || [];
  }

  get isSingleInput(): boolean {
    return this.selectedOp === 'convert';
  }

  get isTemperature(): boolean {
    return this.selectedType === 'TEMPERATURE';
  }

  get supportsArithmetic(): boolean {
    return this.selectedType !== 'TEMPERATURE';
  }

  get filteredOps() {
    if (this.isTemperature) return this.operations.filter(o => o.key === 'convert' || o.key === 'compare');
    return this.operations;
  }

  ngOnInit(): void {
    this.onTypeChange();
  }

  onTypeChange(): void {
    const units = this.availableUnits;
    this.unit1 = units[0];
    this.unit2 = units[1] || units[0];
    this.toUnit = units[1] || units[0];
    if (this.isTemperature && !['convert','compare'].includes(this.selectedOp)) {
      this.selectedOp = 'convert';
    }
  }

  onOpChange(): void {}

  execute(): void {
    this.loading = true;
    this.error = '';
    this.result = null;

    let input: QuantityInputDTO;

    if (this.isSingleInput) {
      input = {
        thisQuantityDTO: { value: this.value1, unit: this.unit1, measurementType: this.selectedType },
        thatQuantityDTO: { value: 0, unit: this.toUnit, measurementType: this.selectedType }
      };
    } else {
      input = {
        thisQuantityDTO: { value: this.value1, unit: this.unit1, measurementType: this.selectedType },
        thatQuantityDTO: { value: this.value2, unit: this.unit2, measurementType: this.selectedType }
      };
    }

    const ops: Record<string, (i: QuantityInputDTO) => any> = {
      convert: (i) => this.svc.convert(i),
      compare: (i) => this.svc.compare(i),
      add: (i) => this.svc.add(i),
      subtract: (i) => this.svc.subtract(i),
      divide: (i) => this.svc.divide(i),
    };

    ops[this.selectedOp](input).subscribe({
      next: (res: QuantityMeasurementResult) => {
        this.result = res;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Operation failed. Is the backend running?';
        this.loading = false;
      }
    });
  }

  getOpLabel(): string {
    return this.operations.find(o => o.key === this.selectedOp)?.label || '';
  }

  getResultDisplay(): string {
    if (!this.result) return '';
    if (this.result.resultString) return this.result.resultString;
    if (this.result.resultValue !== undefined && this.result.resultValue !== null) {
      return `${this.result.resultValue} ${this.result.resultUnit || ''}`;
    }
    return 'Done';
  }

  constructor(private svc: QuantityService) {}
}
