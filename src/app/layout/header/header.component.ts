import { Component, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';

import { ThemeService } from '../../core/services/theme.service';
import { NavigationService } from '../../core/services/navigation.service';
import { Breadcrumb } from '../../shared/interfaces/navigation-state.interface';

/**
 * Header component containing navigation controls, breadcrumbs, and theme toggle.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private navigationService = inject(NavigationService);

  @Output() sidebarToggle = new EventEmitter<void>();

  isDarkTheme$: Observable<boolean> = this.themeService.isDarkTheme();
  breadcrumbs$: Observable<Breadcrumb[]> = this.navigationService.getBreadcrumbs();

  /**
   * Toggle the sidebar open/closed.
   */
  onSidebarToggle(): void {
    this.sidebarToggle.emit();
  }

  /**
   * Toggle between light and dark themes.
   */
  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Navigate to home page.
   */
  onHomeClick(): void {
    this.navigationService.navigateToModule('getting-started');
  }
}