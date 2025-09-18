import { Component, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { NavigationService } from '../../core/services/navigation.service';
import { Breadcrumb } from '../../shared/interfaces/navigation-state.interface';
import { SearchDialogComponent } from '../../shared/components/search-dialog/search-dialog.component';

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
  private navigationService = inject(NavigationService);
  private dialog = inject(MatDialog);

  @Output() sidebarToggle = new EventEmitter<void>();

  breadcrumbs$: Observable<Breadcrumb[]> = this.navigationService.getBreadcrumbs();

  /**
   * Toggle the sidebar open/closed.
   */
  onSidebarToggle(): void {
    this.sidebarToggle.emit();
  }

  /**
   * Navigate to home page.
   */
  onHomeClick(): void {
    this.navigationService.navigateToModule('getting-started');
  }

  /**
   * Open the search dialog.
   */
  onSearchClick(): void {
    this.dialog.open(SearchDialogComponent, {
      width: '90vw',
      maxWidth: '900px',
      height: '80vh',
      panelClass: 'search-dialog'
    });
  }
}