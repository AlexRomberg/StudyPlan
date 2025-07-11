import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../util/types';
import { languages } from '../util/i18n';

@Pipe({
  name: 'language'
})
export class LanguagePipe implements PipeTransform {

  transform(value: Language[]): string {
    return value.map(lang => languages[lang]).join(' / ');
  }

}
