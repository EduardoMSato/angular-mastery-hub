import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentViewerComponent } from '../../layout/content-viewer/content-viewer.component';

import { ContentService } from '../../core/services/content.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LearningSection } from '../../shared/interfaces/learning-module.interface';

/**
 * Component for the Getting Started module.
 * Handles displaying sections within the getting started learning path.
 */
@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [ContentViewerComponent],
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GettingStartedComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private navigationService = inject(NavigationService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  currentSection: LearningSection | null = null;
  loading = false;

  ngOnInit(): void {
    // Listen to route parameter changes
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const sectionId = params['sectionId'];
      if (sectionId) {
        this.loadSection('getting-started', sectionId);
      }
    });

    // Subscribe to content service for current section
    this.contentService.getCurrentSection().pipe(
      takeUntil(this.destroy$)
    ).subscribe(section => {
      this.currentSection = section;
      this.cdr.markForCheck();
    });

    // Subscribe to loading state
    this.contentService.getLoadingState().pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.loading = loading;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load a specific section.
   */
  private loadSection(moduleId: string, sectionId: string): void {
    this.contentService.loadSection(moduleId, sectionId).subscribe({
      next: (section) => {
        this.navigationService.updateCurrentSection(moduleId, sectionId);
      },
      error: (error) => {
        console.error('Failed to load section:', error);
      }
    });
  }
}