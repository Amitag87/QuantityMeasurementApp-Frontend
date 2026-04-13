import { Pipe, PipeTransform } from '@angular/core';
import { OPERATIONS } from '../models/models';

@Pipe({ name: 'opIcon', standalone: true })
export class OpIconPipe implements PipeTransform {
  transform(ops: typeof OPERATIONS, key: string): string {
    return ops.find(o => o.key === key)?.icon || '↔';
  }
}
