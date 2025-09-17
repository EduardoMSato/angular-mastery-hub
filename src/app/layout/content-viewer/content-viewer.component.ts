import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LearningSection } from '../../shared/interfaces/learning-module.interface';

/**
 * Component for displaying learning section content with code examples.
 */
@Component({
  selector: 'app-content-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './content-viewer.component.html',
  styleUrls: ['./content-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentViewerComponent {
  @Input() section: LearningSection | null = null;
  @Input() loading = false;

  /**
   * Get difficulty level icon.
   */
  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'trending_up';
      case 'intermediate':
        return 'trending_flat';
      case 'advanced':
        return 'trending_down';
      default:
        return 'help';
    }
  }

  /**
   * Get difficulty level color.
   */
  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'primary';
      case 'intermediate':
        return 'accent';
      case 'advanced':
        return 'warn';
      default:
        return '';
    }
  }

  /**
   * Track code examples by ID for ngFor performance.
   */
  trackByCodeExampleId(index: number, example: any): string {
    return example.id;
  }
}