import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ContentService } from './content.service';

export interface SearchResult {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  type: 'section' | 'code-example' | 'exercise';
  difficulty: string;
  tags: string[];
  snippet: string;
  relevanceScore: number;
}

export interface SearchFilters {
  difficulty: string;
  moduleId: string;
  tags: string[];
  contentType: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  private searchFiltersSubject = new BehaviorSubject<Partial<SearchFilters>>({});
  private isSearchingSubject = new BehaviorSubject<boolean>(false);

  public searchQuery$ = this.searchQuerySubject.asObservable();
  public searchFilters$ = this.searchFiltersSubject.asObservable();
  public isSearching$ = this.isSearchingSubject.asObservable();

  // Search results observable - will be initialized in constructor
  public searchResults$: Observable<SearchResult[]>;

  constructor(private contentService: ContentService) {
    // Initialize search results observable after contentService is available
    this.searchResults$ = combineLatest([
      this.searchQuery$.pipe(distinctUntilChanged(), debounceTime(300)),
      this.searchFilters$.pipe(distinctUntilChanged()),
      this.contentService.modules$
    ]).pipe(
      map(([query, filters, modules]) => {
        if (!query.trim() && Object.keys(filters).length === 0) {
          return [];
        }
        return this.performSearch(query, filters, modules);
      })
    );
  }

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  setSearchFilters(filters: Partial<SearchFilters>): void {
    this.searchFiltersSubject.next({ ...this.searchFiltersSubject.value, ...filters });
  }

  clearSearchFilters(): void {
    this.searchFiltersSubject.next({});
  }

  private performSearch(
    query: string,
    filters: Partial<SearchFilters>,
    modules: any[]
  ): SearchResult[] {
    this.isSearchingSubject.next(true);

    const results: SearchResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    modules.forEach(module => {
      module.sections?.forEach((section: any) => {
        // Search in section content
        if (this.matchesFilters(section, filters)) {
          const sectionScore = this.calculateRelevanceScore(section, normalizedQuery);
          if (sectionScore > 0) {
            results.push({
              id: section.id,
              moduleId: module.id,
              title: section.title,
              content: section.content || '',
              type: 'section',
              difficulty: section.difficulty || 'beginner',
              tags: section.tags || [],
              snippet: this.generateSnippet(section.content || '', normalizedQuery),
              relevanceScore: sectionScore
            });
          }
        }

        // Search in code examples
        section.codeExamples?.forEach((example: any) => {
          if (this.matchesFilters(example, filters)) {
            const exampleScore = this.calculateRelevanceScore(example, normalizedQuery);
            if (exampleScore > 0) {
              results.push({
                id: `${section.id}-${example.id}`,
                moduleId: module.id,
                title: `${section.title} - ${example.title}`,
                content: example.description || '',
                type: 'code-example',
                difficulty: section.difficulty || 'beginner',
                tags: section.tags || [],
                snippet: this.generateSnippet(example.description || example.code || '', normalizedQuery),
                relevanceScore: exampleScore
              });
            }
          }
        });

        // Search in exercises
        section.exercises?.forEach((exercise: any) => {
          if (this.matchesFilters(exercise, filters)) {
            const exerciseScore = this.calculateRelevanceScore(exercise, normalizedQuery);
            if (exerciseScore > 0) {
              results.push({
                id: `${section.id}-${exercise.id}`,
                moduleId: module.id,
                title: `${section.title} - ${exercise.title}`,
                content: exercise.description || '',
                type: 'exercise',
                difficulty: section.difficulty || 'beginner',
                tags: section.tags || [],
                snippet: this.generateSnippet(exercise.description || '', normalizedQuery),
                relevanceScore: exerciseScore
              });
            }
          }
        });
      });
    });

    // Sort by relevance score (highest first)
    const sortedResults = results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    this.isSearchingSubject.next(false);
    return sortedResults.slice(0, 50); // Limit to top 50 results
  }

  private calculateRelevanceScore(item: any, query: string): number {
    if (!query) return 0;

    let score = 0;
    const title = (item.title || '').toLowerCase();
    const content = (item.content || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const tags = (item.tags || []).join(' ').toLowerCase();

    // Title matches (highest weight)
    if (title.includes(query)) {
      score += 10;
      if (title.startsWith(query)) score += 5;
    }

    // Tag matches (high weight)
    if (tags.includes(query)) {
      score += 8;
    }

    // Description matches (medium weight)
    if (description.includes(query)) {
      score += 5;
    }

    // Content matches (lower weight)
    if (content.includes(query)) {
      score += 2;
    }

    // Exact word matches get bonus points
    const words = query.split(' ');
    words.forEach(word => {
      if (word.length > 2) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (regex.test(title)) score += 3;
        if (regex.test(description)) score += 2;
        if (regex.test(tags)) score += 2;
      }
    });

    return score;
  }

  private matchesFilters(item: any, filters: Partial<SearchFilters>): boolean {
    if (filters.difficulty && item.difficulty !== filters.difficulty) {
      return false;
    }

    if (filters.tags && filters.tags.length > 0) {
      const itemTags = item.tags || [];
      const hasMatchingTag = filters.tags.some(tag =>
        itemTags.some((itemTag: string) =>
          itemTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  }

  private generateSnippet(content: string, query: string, maxLength: number = 150): string {
    if (!content || !query) return content.substring(0, maxLength) + '...';

    const normalizedContent = content.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    const queryIndex = normalizedContent.indexOf(normalizedQuery);

    if (queryIndex === -1) {
      return content.substring(0, maxLength) + '...';
    }

    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, queryIndex + query.length + 50);

    let snippet = content.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    // Highlight the query term (simple implementation)
    const regex = new RegExp(`(${query})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');

    return snippet;
  }

  // Get available filter options
  getAvailableFilters(): Observable<{
    difficulties: string[],
    modules: Array<{id: string, title: string}>,
    tags: string[]
  }> {
    return this.contentService.modules$.pipe(
      map(modules => {
        const difficulties = new Set<string>();
        const moduleOptions: Array<{id: string, title: string}> = [];
        const tags = new Set<string>();

        modules.forEach(module => {
          moduleOptions.push({ id: module.id, title: module.title });

          module.sections?.forEach((section: any) => {
            if (section.difficulty) difficulties.add(section.difficulty);
            if (section.tags) {
              section.tags.forEach((tag: string) => tags.add(tag));
            }
          });
        });

        return {
          difficulties: Array.from(difficulties).sort(),
          modules: moduleOptions,
          tags: Array.from(tags).sort()
        };
      })
    );
  }

  // Search suggestions based on partial query
  getSearchSuggestions(partialQuery: string): Observable<string[]> {
    return this.contentService.modules$.pipe(
      map(modules => {
        const suggestions = new Set<string>();
        const query = partialQuery.toLowerCase();

        if (query.length < 2) return [];

        modules.forEach(module => {
          // Add module titles as suggestions
          if (module.title.toLowerCase().includes(query)) {
            suggestions.add(module.title);
          }

          module.sections?.forEach((section: any) => {
            // Add section titles
            if (section.title.toLowerCase().includes(query)) {
              suggestions.add(section.title);
            }

            // Add relevant tags
            section.tags?.forEach((tag: string) => {
              if (tag.toLowerCase().includes(query)) {
                suggestions.add(tag);
              }
            });
          });
        });

        return Array.from(suggestions).slice(0, 10);
      })
    );
  }
}