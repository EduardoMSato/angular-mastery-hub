import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    SearchComponent
  ],
  template: `
    <div class="search-dialog-container">
      <div class="search-dialog-header" mat-dialog-title>
        <h2>Search Learning Content</h2>
        <button (click)="close()" aria-label="Close search" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="search-dialog-content" mat-dialog-content>
        <app-search></app-search>
      </div>
    </div>
  `,
  styles: [`
    .search-dialog-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .search-dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 16px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #333;
      }

      .close-button {
        border: none;
        background: none;
        padding: 0;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;

        mat-icon {
          color: #666;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
    }

    .search-dialog-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      margin: 0;
    }

    :host ::ng-deep .search-dialog {
      .mat-mdc-dialog-container {
        padding: 24px;
      }
    }
  `]
})
export class SearchDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}