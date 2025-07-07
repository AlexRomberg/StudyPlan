import { computed, effect, inject, Injectable, resource, signal } from '@angular/core';
import { DBService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private db = inject(DBService);

  // State
  private temporaryState = signal({
    menuOpen: false,
  });
  private persistentState = signal({
    degreeProgram: 'I-VZ',
    moduleGrouping: "I"
  });
  private lists = resource({
    loader: async () => ({
      degreePrograms: await this.db.getDegreePrograms(),
    })
  });

  private state = computed(() => ({
    ...this.temporaryState(),
    ...this.persistentState(),
    ...this.lists.value(),
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
  public moduleGrouping = computed(() => this.state().moduleGrouping);
  public degreeProgram = computed(() => this.state().degreeProgram);
  public degreeProgramList = computed(() => this.state().degreePrograms);

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

  public setModuleGrouping(moduleGrouping: string) {
    this.persistentState.update(state => ({
      ...state,
      moduleGrouping
    }));
  }
}