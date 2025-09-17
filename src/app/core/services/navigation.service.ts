import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NavigationState, Breadcrumb } from '../../shared/interfaces/navigation-state.interface';

/**
 * Service responsible for managing application navigation state.
 * Handles current module/section tracking, sidebar state, and breadcrumbs.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);

  private state$ = new BehaviorSubject<NavigationState>({
    currentModule: '',
    currentSection: '',
    sidebarOpen: false,
    breadcrumbs: []
  });

  constructor() {
    // Listen to router events to update navigation state
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateNavigationFromRoute(event.url);
    });

    // Set initial sidebar state based on screen size
    this.initializeSidebarState();
  }

  /**
   * Get the current navigation state.
   */
  getState(): Observable<NavigationState> {
    return this.state$.asObservable();
  }

  /**
   * Get current module ID.
   */
  getCurrentModule(): Observable<string> {
    return this.state$.pipe(
      map(state => state.currentModule)
    );
  }

  /**
   * Get current section ID.
   */
  getCurrentSection(): Observable<string> {
    return this.state$.pipe(
      map(state => state.currentSection)
    );
  }

  /**
   * Get sidebar open state.
   */
  getSidebarState(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.sidebarOpen)
    );
  }

  /**
   * Get breadcrumbs.
   */
  getBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.state$.pipe(
      map(state => state.breadcrumbs)
    );
  }

  /**
   * Navigate to a specific module and section.
   */
  navigateToSection(moduleId: string, sectionId: string): void {
    const route = `/${moduleId}/${sectionId}`;
    this.router.navigate([route]);
  }

  /**
   * Navigate to a module (first section).
   */
  navigateToModule(moduleId: string): void {
    this.router.navigate([`/${moduleId}`]);
  }

  /**
   * Toggle sidebar open/closed state.
   */
  toggleSidebar(): void {
    const currentState = this.state$.value;
    this.updateState({
      ...currentState,
      sidebarOpen: !currentState.sidebarOpen
    });
  }

  /**
   * Set sidebar open state explicitly.
   */
  setSidebarOpen(open: boolean): void {
    const currentState = this.state$.value;
    this.updateState({
      ...currentState,
      sidebarOpen: open
    });
  }

  /**
   * Update current module and section.
   */
  updateCurrentSection(moduleId: string, sectionId: string): void {
    const currentState = this.state$.value;
    const breadcrumbs = this.generateBreadcrumbs(moduleId, sectionId);

    this.updateState({
      ...currentState,
      currentModule: moduleId,
      currentSection: sectionId,
      breadcrumbs
    });
  }

  /**
   * Navigate to the next section in sequence.
   */
  navigateToNext(): void {
    // TODO: Implement navigation to next section based on module structure
    console.log('Navigate to next section');
  }

  /**
   * Navigate to the previous section in sequence.
   */
  navigateToPrevious(): void {
    // TODO: Implement navigation to previous section based on module structure
    console.log('Navigate to previous section');
  }

  /**
   * Update navigation state from current route.
   */
  private updateNavigationFromRoute(url: string): void {
    // Parse URL to extract module and section
    // Expected format: /module-id/section-id or /module-id
    const segments = url.split('/').filter(segment => segment.length > 0);

    if (segments.length >= 1) {
      const moduleId = segments[0];
      const sectionId = segments[1] || '';

      this.updateCurrentSection(moduleId, sectionId);
    }
  }

  /**
   * Generate breadcrumbs for current navigation.
   */
  private generateBreadcrumbs(moduleId: string, sectionId: string): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: 'Home',
        route: '/',
        isActive: false
      }
    ];

    if (moduleId) {
      // Convert module ID to display name
      const moduleLabel = this.formatModuleName(moduleId);
      breadcrumbs.push({
        label: moduleLabel,
        route: `/${moduleId}`,
        isActive: !sectionId
      });
    }

    if (sectionId) {
      // Convert section ID to display name
      const sectionLabel = this.formatSectionName(sectionId);
      breadcrumbs.push({
        label: sectionLabel,
        route: `/${moduleId}/${sectionId}`,
        isActive: true
      });
    }

    return breadcrumbs;
  }

  /**
   * Format module ID to display name.
   */
  private formatModuleName(moduleId: string): string {
    return moduleId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Format section ID to display name.
   */
  private formatSectionName(sectionId: string): string {
    return sectionId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Initialize sidebar state based on screen size.
   */
  private initializeSidebarState(): void {
    const isMobile = window.innerWidth < 768;
    const currentState = this.state$.value;

    this.updateState({
      ...currentState,
      sidebarOpen: !isMobile
    });
  }

  /**
   * Update the navigation state.
   */
  private updateState(newState: NavigationState): void {
    this.state$.next(newState);
  }
}