import { computed, effect, inject, Injectable, resource, signal } from '@angular/core';
import { DBService } from './db.service';
import { ModuleDefinition } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private db = inject(DBService);

  // State
  private temporaryState = signal({
    menuOpen: false,
    dialogData: undefined as { module: ModuleDefinition, resolve: () => void, semesterIndex?: number, moduleIndex?: number } | undefined
  });
  private persistentState = signal({
    degreeProgram: 'I-VZ',
    moduleScope: "Informatik"
  });

  private state = computed(() => ({
    ...this.temporaryState(),
    ...this.persistentState(),
  }));

  // State loading
  constructor() {
    const storedState = window.localStorage.getItem('module-app-state');
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        this.persistentState.set({
          ...this.persistentState(),
          ...parsedState,
        });
      } catch (e) {
        console.error('Failed to parse stored state:', e);
      }
    }

    effect(() => {
      window.localStorage.setItem('module-app-state', JSON.stringify(this.persistentState()));
    })
  }

  // Selectors
  public menuOpen = computed(() => this.state().menuOpen);
  public moduleScope = computed(() => this.state().moduleScope);
  public degreeProgram = computed(() => this.state().degreeProgram);
  public dialogData = computed(() => this.state().dialogData);

  // Setters
  public setMenuOpen(menuOpen: boolean) {
    this.temporaryState.update(state => ({
      ...state,
      menuOpen
    }));
  }

  public setDegreeProgram(degreeProgram: string) {
    this.persistentState.update(state => ({
      ...state,
      degreeProgram
    }));
  }

  public setModuleScope(moduleGrouping: string) {
    this.persistentState.update(state => ({
      ...state,
      moduleScope: moduleGrouping
    }));
  }

  public setDialogData(module: ModuleDefinition, resolve: () => void, semesterIndex?: number, moduleIndex?: number) {
    this.temporaryState.update(state => ({
      ...state,
      dialogData: {
        module,
        resolve: () => {
          this.temporaryState.update(s => ({ ...s, dialogData: undefined }));
          resolve();
        },
        semesterIndex,
        moduleIndex
      }
    }));
  }
}