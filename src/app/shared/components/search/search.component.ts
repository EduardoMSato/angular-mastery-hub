import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchService, SearchResult, SearchFilters } from '../../../core/services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ],
  template: `
    <div class="search-container">
      <!-- Search Input -->
      <div class="search-input-section">
        <mat-form-field class="search-field" appearance="outline">
          <mat-label>Search learning content...</mat-label>
          <input
            matInput
            [(ngModel)]="searchQuery"
            (input)="onSearchInput($event)"
            [matAutocomplete]="auto"
            placeholder="e.g., components, data binding, services">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onSuggestionSelected($event)">
          <mat-option *ngFor="let suggestion of suggestions" [value]="suggestion">
            {{ suggestion }}
          </mat-option>
        </mat-autocomplete>
      </div>

      <!-- Search Filters -->
      <div class="search-filters" *ngIf="showFilters">
        <div class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Difficulty</mat-label>
            <mat-select [(ngModel)]="selectedFilters.difficulty" (selectionChange)="onFilterChange()">
              <mat-option value="">All Levels</mat-option>
              <mat-option *ngFor="let difficulty of availableFilters.difficulties" [value]="difficulty">
                {{ difficulty | titlecase }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Module</mat-label>
            <mat-select [(ngModel)]="selectedFilters.moduleId" (selectionChange)="onFilterChange()">
              <mat-option value="">All Modules</mat-option>
              <mat-option *ngFor="let module of availableFilters.modules" [value]="module.id">
                {{ module.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Content Type</mat-label>
            <mat-select [(ngModel)]="selectedFilters.contentType" (selectionChange)="onFilterChange()">
              <mat-option value="">All Types</mat-option>
              <mat-option value="section">Sections</mat-option>
              <mat-option value="code-example">Code Examples</mat-option>
              <mat-option value="exercise">Exercises</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Tag Chips -->
        <div class="tag-filters" *ngIf="availableFilters.tags.length > 0">
          <h4>Popular Tags:</h4>
          <mat-chip-listbox class="tag-list">
            <mat-chip-option
              *ngFor="let tag of popularTags"
              (click)="toggleTag(tag)"
              [selected]="isTagSelected(tag)">
              {{ tag }}
            </mat-chip-option>
          </mat-chip-listbox>
        </div>

        <div class="filter-actions">
          <button mat-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Clear Filters
          </button>
          <button mat-button (click)="toggleFilters()">
            <mat-icon>expand_less</mat-icon>
            Hide Filters
          </button>
        </div>
      </div>

      <!-- Show/Hide Filters Button -->
      <div class="filter-toggle" *ngIf="!showFilters">
        <button mat-button (click)="toggleFilters()">
          <mat-icon>tune</mat-icon>
          Show Filters
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isSearching">
        <mat-spinner diameter="30"></mat-spinner>
        <p>Searching...</p>
      </div>

      <!-- Search Results -->
      <div class="search-results" *ngIf="searchResults.length > 0 && !isSearching">
        <div class="results-header">
          <h3>Search Results ({{ searchResults.length }})</h3>
          <div class="results-info">
            <span *ngIf="searchQuery">for "{{ searchQuery }}"</span>
          </div>
        </div>

        <div class="results-list">
          <div
            *ngFor="let result of searchResults; trackBy: trackByResultId"
            class="result-item"
            [class.result-section]="result.type === 'section'"
            [class.result-code-example]="result.type === 'code-example'"
            [class.result-exercise]="result.type === 'exercise'"
            (click)="navigateToResult(result)">

            <div class="result-header">
              <div class="result-type-icon">
                <mat-icon *ngIf="result.type === 'section'">article</mat-icon>
                <mat-icon *ngIf="result.type === 'code-example'">code</mat-icon>
                <mat-icon *ngIf="result.type === 'exercise'">assignment</mat-icon>
              </div>

              <div class="result-meta">
                <h4 class="result-title">{{ result.title }}</h4>
                <div class="result-badges">
                  <span class="badge badge-type">{{ result.type | titlecase }}</span>
                  <span class="badge badge-difficulty" [class]="'difficulty-' + result.difficulty">
                    {{ result.difficulty | titlecase }}
                  </span>
                  <span class="badge badge-score">{{ result.relevanceScore }}% match</span>
                </div>
              </div>
            </div>

            <div class="result-content">
              <p class="result-snippet" [innerHTML]="result.snippet"></p>
            </div>

            <div class="result-tags" *ngIf="result.tags.length > 0">
              <mat-chip-listbox>
                <mat-chip-option *ngFor="let tag of result.tags.slice(0, 5)" disabled>
                  {{ tag }}
                </mat-chip-option>
              </mat-chip-listbox>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div class="no-results" *ngIf="searchResults.length === 0 && searchQuery && !isSearching">
        <div class="no-results-content">
          <mat-icon>search_off</mat-icon>
          <h3>No results found</h3>
          <p>Try adjusting your search terms or filters</p>
          <div class="suggestions">
            <p><strong>Suggestions:</strong></p>
            <ul>
              <li>Check your spelling</li>
              <li>Use fewer or different keywords</li>
              <li>Try broader search terms</li>
              <li>Remove some filters</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!searchQuery && searchResults.length === 0">
        <div class="empty-state-content">
          <mat-icon>search</mat-icon>
          <h3>Search Angular Mastery Hub</h3>
          <p>Find sections, code examples, and exercises across all learning modules</p>
          <div class="search-tips">
            <h4>Search Tips:</h4>
            <ul>
              <li>Try keywords like "component", "service", "directive"</li>
              <li>Search for specific concepts like "data binding" or "dependency injection"</li>
              <li>Use filters to narrow down results by difficulty or module</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery = '';
  searchResults: SearchResult[] = [];
  isSearching = false;
  showFilters = false;
  suggestions: string[] = [];

  selectedFilters: Partial<SearchFilters> = {
    difficulty: '',
    moduleId: '',
    tags: [],
    contentType: ''
  };

  availableFilters = {
    difficulties: [] as string[],
    modules: [] as Array<{id: string, title: string}>,
    tags: [] as string[]
  };

  popularTags: string[] = [];

  private subscriptions = new Subscription();

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to search results
    this.subscriptions.add(
      this.searchService.searchResults$.subscribe(results => {
        this.searchResults = results;
      })
    );

    // Subscribe to loading state
    this.subscriptions.add(
      this.searchService.isSearching$.subscribe(isSearching => {
        this.isSearching = isSearching;
      })
    );

    // Load available filters
    this.subscriptions.add(
      this.searchService.getAvailableFilters().subscribe(filters => {
        this.availableFilters = filters;
        this.popularTags = filters.tags.slice(0, 15); // Show top 15 tags
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.searchService.setSearchQuery(query);

    // Load suggestions
    if (query.length >= 2) {
      this.subscriptions.add(
        this.searchService.getSearchSuggestions(query).subscribe(suggestions => {
          this.suggestions = suggestions;
        })
      );
    } else {
      this.suggestions = [];
    }
  }

  onSuggestionSelected(event: any) {
    this.searchQuery = event.option.value;
    this.searchService.setSearchQuery(this.searchQuery);
  }

  onFilterChange() {
    const filters: Partial<SearchFilters> = {};

    if (this.selectedFilters.difficulty) {
      filters.difficulty = this.selectedFilters.difficulty;
    }

    if (this.selectedFilters.moduleId) {
      filters.moduleId = this.selectedFilters.moduleId;
    }

    if (this.selectedFilters.contentType) {
      filters.contentType = this.selectedFilters.contentType;
    }

    if (this.selectedFilters.tags && this.selectedFilters.tags.length > 0) {
      filters.tags = this.selectedFilters.tags;
    }

    this.searchService.setSearchFilters(filters);
  }

  toggleTag(tag: string) {
    if (!this.selectedFilters.tags) {
      this.selectedFilters.tags = [];
    }

    const index = this.selectedFilters.tags.indexOf(tag);
    if (index >= 0) {
      this.selectedFilters.tags.splice(index, 1);
    } else {
      this.selectedFilters.tags.push(tag);
    }

    this.onFilterChange();
  }

  isTagSelected(tag: string): boolean {
    return this.selectedFilters.tags?.includes(tag) || false;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearFilters() {
    this.selectedFilters = {
      difficulty: '',
      moduleId: '',
      tags: [],
      contentType: ''
    };
    this.searchService.clearSearchFilters();
  }

  navigateToResult(result: SearchResult) {
    // Navigate to the specific section
    const route = `/${result.moduleId}`;
    this.router.navigate([route], {
      fragment: result.id
    });
  }

  trackByResultId(index: number, result: SearchResult): string {
    return result.id;
  }
}