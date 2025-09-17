import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeType } from '../../shared/enums/difficulty-level.enum';

/**
 * Service responsible for managing application theme and appearance.
 * Handles theme switching, persistence, and system preference detection.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'angular-mastery-hub-theme';
  private currentTheme$ = new BehaviorSubject<ThemeType>(ThemeType.LIGHT);

  constructor() {
    this.initializeTheme();
    this.listenToSystemThemeChanges();
  }

  /**
   * Get the current theme.
   */
  getCurrentTheme(): Observable<ThemeType> {
    return this.currentTheme$.asObservable();
  }

  /**
   * Set the application theme.
   */
  setTheme(theme: ThemeType): void {
    this.currentTheme$.next(theme);
    this.applyTheme(theme);
    this.saveThemePreference(theme);
  }

  /**
   * Toggle between light and dark themes.
   */
  toggleTheme(): void {
    const current = this.currentTheme$.value;
    const newTheme = current === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT;
    this.setTheme(newTheme);
  }

  /**
   * Check if the current theme is dark.
   */
  isDarkTheme(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.currentTheme$.subscribe(theme => {
        observer.next(this.resolveTheme(theme) === ThemeType.DARK);
      });
    });
  }

  /**
   * Initialize theme from saved preference or system default.
   */
  private initializeTheme(): void {
    const savedTheme = this.getSavedThemePreference();
    const initialTheme = savedTheme || this.getSystemTheme();
    this.setTheme(initialTheme);
  }

  /**
   * Apply theme to the DOM.
   */
  private applyTheme(theme: ThemeType): void {
    const resolvedTheme = this.resolveTheme(theme);
    const body = document.body;

    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');

    // Add new theme class
    body.classList.add(`${resolvedTheme}-theme`);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(resolvedTheme);
  }

  /**
   * Resolve theme (handle auto theme based on system preference).
   */
  private resolveTheme(theme: ThemeType): ThemeType {
    if (theme === ThemeType.AUTO) {
      return this.getSystemTheme();
    }
    return theme;
  }

  /**
   * Get system theme preference.
   */
  private getSystemTheme(): ThemeType {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeType.DARK
        : ThemeType.LIGHT;
    }
    return ThemeType.LIGHT;
  }

  /**
   * Listen to system theme changes and update if using auto theme.
   */
  private listenToSystemThemeChanges(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', () => {
        if (this.currentTheme$.value === ThemeType.AUTO) {
          this.applyTheme(ThemeType.AUTO);
        }
      });
    }
  }

  /**
   * Save theme preference to localStorage.
   */
  private saveThemePreference(theme: ThemeType): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    }
  }

  /**
   * Get saved theme preference from localStorage.
   */
  private getSavedThemePreference(): ThemeType | null {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (saved && Object.values(ThemeType).includes(saved as ThemeType)) {
        return saved as ThemeType;
      }
    }
    return null;
  }

  /**
   * Update meta theme-color for mobile browsers.
   */
  private updateMetaThemeColor(theme: ThemeType): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === ThemeType.DARK ? '#1e1e1e' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }
}