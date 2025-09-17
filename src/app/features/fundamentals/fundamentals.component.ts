import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentViewerComponent } from '../../layout/content-viewer/content-viewer.component';
import { ContentService } from '../../core/services/content.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LearningSection } from '../../shared/interfaces/learning-module.interface';

@Component({
  selector: 'app-fundamentals',
  standalone: true,
  imports: [ContentViewerComponent],
  templateUrl: './fundamentals.component.html',
  styleUrls: ['./fundamentals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundamentalsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private navigationService = inject(NavigationService);
  private destroy$ = new Subject<void>();

  currentSection: LearningSection | null = null;
  loading = false;

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const sectionId = params['sectionId'];
      if (sectionId) {
        this.loadSection('fundamentals', sectionId);
      }
    });

    this.contentService.getCurrentSection().pipe(
      takeUntil(this.destroy$)
    ).subscribe(section => {
      this.currentSection = section;
    });

    this.contentService.getLoadingState().pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.loading = loading;
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