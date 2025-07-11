import { computed, effect, Injectable, signal } from '@angular/core';
import { ModuleDefinition } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // State
  private temporaryState = signal({
    menuOpen: false,
    dialogData: undefined as { module: { current: string, template?: string }, resolve: () => void, semesterIndex?: number, moduleIndex?: number } | undefined
  });
  private persistentState = signal({
    moduleScope: "Informatik",
    hasSeenIntro: false,
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
  public hasSeenIntro = computed(() => this.state().hasSeenIntro);
  public moduleScope = computed(() => this.state().moduleScope);
  public dialogData = computed(() => this.state().dialogData);

  // Setters
  public setMenuOpen(menuOpen: boolean) {
    this.temporaryState.update(state => ({
      ...state,
      menuOpen
    }));
  }

  public setModuleScope(moduleGrouping: string) {
    this.persistentState.update(state => ({
      ...state,
      moduleScope: moduleGrouping
    }));
  }

  public setDialogData(module: { current: string, template?: string }, resolve: () => void, semesterIndex?: number, moduleIndex?: number) {
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

  public closeIntroDialog() {
    this.persistentState.update(state => ({
      ...state,
      hasSeenIntro: true
    }));
  }
}