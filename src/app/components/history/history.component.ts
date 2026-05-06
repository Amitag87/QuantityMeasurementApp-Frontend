import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuantityService } from '../../services/quantity.service';
import { QuantityMeasurementResult, OPERATIONS } from '../../models/models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  records: QuantityMeasurementResult[] = [];
  filtered: QuantityMeasurementResult[] = [];
  operations = OPERATIONS;
  selectedFilter = 'ALL';
  loading = false;
  error = '';
  counts: Record<string, number> = {};

  constructor(private svc: QuantityService) {}

  ngOnInit(): void {
    this.loadHistory();
    this.loadCounts();
  }

  loadHistory(): void {
    this.loading = true;
    this.error = '';
    console.log('Loading history, selectedFilter:', this.selectedFilter);
    const obs = this.selectedFilter === 'ALL'
      ? this.svc.getHistory()
      : this.svc.getHistoryByOperation(this.selectedFilter.toLowerCase());

    obs.subscribe({
      next: (data) => {
        console.log('History data received:', data);
        this.records = data;
        this.filtered = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('History loading error:', err);
        this.error = err?.error?.message || 'Could not load history.';
        this.loading = false;
      }
    });
  }

  loadCounts(): void {
    this.operations.forEach(op => {
      this.svc.getOperationCount(op.key).subscribe({
        next: (count) => this.counts[op.key] = count,
        error: () => {}
      });
    });
  }

  setFilter(f: string): void {
    this.selectedFilter = f;
    this.loadHistory();
  }

  formatDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getResultDisplay(r: QuantityMeasurementResult): string {
    if (r.error) return r.errorMessage || 'Error';
    if (r.resultString) return r.resultString;
    if (r.resultValue !== undefined && r.resultValue !== null) {
      const val = parseFloat(r.resultValue.toString()).toPrecision(6).replace(/\.?0+$/, '');
      return `${val} ${r.resultUnit || ''}`;
    }
    return '—';
  }

  getOpIcon(op: string): string {
    const found = this.operations.find(o => o.key.toLowerCase() === op?.toLowerCase());
    return found ? found.icon : '•';
  }

  totalCount(): number {
    return Object.values(this.counts).reduce((a, b) => a + b, 0);
  }
}
