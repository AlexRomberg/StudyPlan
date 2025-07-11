import { Pipe, PipeTransform } from '@angular/core';
import { Semester } from '../util/types';
import { semesters } from '../util/i18n';

@Pipe({
  name: 'semester'
})
export class SemesterPipe implements PipeTransform {

  transform(value: Semester[]): string {
    return value.map(sem => semesters[sem]).join(' / ');
  }

}
