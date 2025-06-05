import { Injectable } from '@angular/core';
import { degreeProgram } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {

  constructor() { }

  getDegreeProgram(): degreeProgram {
    return (localStorage.getItem("degreeProgram") as degreeProgram) ?? "I-VZ";
  }

  setDegreeProgram(degreeProgram: degreeProgram) {
    localStorage.setItem("degreeProgram", degreeProgram);
  }
}
