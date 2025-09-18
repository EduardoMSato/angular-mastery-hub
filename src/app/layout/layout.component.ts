import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { NavigationService } from '../core/services/navigation.service';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

/**
 * Main layout component that provides the application shell.
 * Manages the header, sidebar, main content area, and footer.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  private navigationService = inject(NavigationService);

  sidebarOpen$: Observable<boolean> = this.navigationService.getSidebarState();

  ngOnInit(): void {
    // Initialize any layout-specific setup here
  }

  /**
   * Handle sidebar toggle from header or other components.
   */
  onSidebarToggle(): void {
    this.navigationService.toggleSidebar();
  }

  /**
   * Handle backdrop click to close sidebar on mobile.
   */
  onBackdropClick(): void {
    this.navigationService.setSidebarOpen(false);
  }
}