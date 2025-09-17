import { Component, Input, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

import { ContentService } from '../../core/services/content.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LearningModule } from '../../shared/interfaces/learning-module.interface';

/**
 * Sidebar component containing the navigation tree for learning modules and sections.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  private contentService = inject(ContentService);
  private navigationService = inject(NavigationService);

  @Input() isOpen = false;

  modules$: Observable<LearningModule[]> = this.contentService.getModules();
  loading$: Observable<boolean> = this.contentService.getLoadingState();
  currentModule$: Observable<string> = this.navigationService.getCurrentModule();
  currentSection$: Observable<string> = this.navigationService.getCurrentSection();

  ngOnInit(): void {
    // Load modules when component initializes
    this.contentService.loadModules().subscribe({
      error: (error) => {
        console.error('Failed to load modules in sidebar:', error);
      }
    });
  }

  /**
   * Navigate to a specific section.
   */
  onSectionClick(moduleId: string, sectionId: string): void {
    this.navigationService.navigateToSection(moduleId, sectionId);
  }

  /**
   * Navigate to a module (first section).
   */
  onModuleClick(moduleId: string): void {
    this.navigationService.navigateToModule(moduleId);
  }

  /**
   * Track modules by ID for ngFor performance.
   */
  trackByModuleId(index: number, module: LearningModule): string {
    return module.id;
  }

  /**
   * Track sections by ID for ngFor performance.
   */
  trackBySectionId(index: number, section: any): string {
    return section.id;
  }
}