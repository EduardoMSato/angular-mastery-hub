import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LearningModule, LearningSection } from '../../shared/interfaces/learning-module.interface';

/**
 * Service responsible for managing educational content.
 * Handles loading modules, sections, and content validation.
 */
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private http = inject(HttpClient);

  private readonly CONTENT_BASE = '/assets/content';
  private modulesSubject$ = new BehaviorSubject<LearningModule[]>([]);
  public modules$ = this.modulesSubject$.asObservable();
  private currentSection$ = new BehaviorSubject<LearningSection | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);

  /**
   * Get all available learning modules.
   */
  getModules(): Observable<LearningModule[]> {
    return this.modules$;
  }

  /**
   * Get the currently active learning section.
   */
  getCurrentSection(): Observable<LearningSection | null> {
    return this.currentSection$.asObservable();
  }

  /**
   * Get loading state.
   */
  getLoadingState(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  /**
   * Load all learning modules from the server.
   */
  loadModules(): Observable<LearningModule[]> {
    this.loading$.next(true);

    return this.http.get<{ modules: LearningModule[] }>(`${this.CONTENT_BASE}/modules.json`)
      .pipe(
        map(response => response.modules),
        tap(modules => {
          this.validateModules(modules);
          this.modulesSubject$.next(modules);
          this.loading$.next(false);
        }),
        catchError(error => {
          console.error('Failed to load modules:', error);
          this.loading$.next(false);
          return throwError(() => new Error('Failed to load learning modules'));
        })
      );
  }

  /**
   * Load a specific learning section.
   */
  loadSection(moduleId: string, sectionId: string): Observable<LearningSection> {
    if (!moduleId || moduleId.trim().length === 0) {
      return throwError(() => new Error('Module ID is required'));
    }

    if (!sectionId || sectionId.trim().length === 0) {
      return throwError(() => new Error('Section ID is required'));
    }

    // Validate module and section IDs format
    if (!/^[a-z-]+$/.test(moduleId)) {
      return throwError(() => new Error('Invalid module ID format'));
    }

    if (!/^[a-z-]+$/.test(sectionId)) {
      return throwError(() => new Error('Invalid section ID format'));
    }

    this.loading$.next(true);

    return this.http.get<LearningSection>(`${this.CONTENT_BASE}/sections/${moduleId}/${sectionId}.json`)
      .pipe(
        tap(section => {
          this.validateSection(section);
          this.currentSection$.next(section);
          this.loading$.next(false);
        }),
        catchError(error => {
          console.error(`Failed to load section ${sectionId}:`, error);
          this.loading$.next(false);
          return throwError(() => new Error(`Section ${sectionId} not found`));
        })
      );
  }

  /**
   * Get a specific module by ID.
   */
  getModule(moduleId: string): Observable<LearningModule | null> {
    return this.modulesSubject$.pipe(
      map(modules => modules.find(module => module.id === moduleId) || null)
    );
  }

  /**
   * Search for content across all modules and sections.
   */
  searchContent(query: string): Observable<LearningSection[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const searchTerm = query.toLowerCase().trim();

    return this.modulesSubject$.pipe(
      map(modules => {
        const results: LearningSection[] = [];

        modules.forEach(module => {
          module.sections.forEach(section => {
            // Search in title, content, and tags
            const titleMatch = section.title.toLowerCase().includes(searchTerm);
            const contentMatch = section.content.toLowerCase().includes(searchTerm);
            const tagMatch = section.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            if (titleMatch || contentMatch || tagMatch) {
              results.push(section);
            }
          });
        });

        return results;
      })
    );
  }

  /**
   * Validate module data structure.
   */
  private validateModules(modules: LearningModule[]): void {
    if (!Array.isArray(modules)) {
      throw new Error('Modules data must be an array');
    }

    modules.forEach((module, index) => {
      if (!module.id || !module.title) {
        throw new Error(`Module at index ${index} is missing required fields (id, title)`);
      }
    });
  }

  /**
   * Validate section data structure.
   */
  private validateSection(section: LearningSection): void {
    if (!section.id || !section.moduleId || !section.title) {
      throw new Error('Section is missing required fields (id, moduleId, title)');
    }

    if (!section.content) {
      console.warn(`Section ${section.id} has no content`);
    }
  }
}