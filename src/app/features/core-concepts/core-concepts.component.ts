import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentViewerComponent } from '../../layout/content-viewer/content-viewer.component';
import { ContentService } from '../../core/services/content.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LearningSection } from '../../shared/interfaces/learning-module.interface';

@Component({
  selector: 'app-core-concepts',
  standalone: true,
  imports: [ContentViewerComponent],
  templateUrl: './core-concepts.component.html',
  styleUrls: ['./core-concepts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreConceptsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private navigationService = inject(NavigationService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  currentSection: LearningSection | null = null;
  loading = false;

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const sectionId = params['sectionId'];
      if (sectionId) {
        this.loadSection('core-concepts', sectionId);
      } else {
        // Clear current section to show welcome page
        this.contentService.clearCurrentSection();
        this.navigationService.updateCurrentSection('core-concepts', '');
      }
    });

    this.contentService.getCurrentSection().pipe(
      takeUntil(this.destroy$)
    ).subscribe(section => {
      this.currentSection = section;
      this.cdr.markForCheck();
    });

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