/**
 * Represents the current navigation state of the application.
 */
export interface NavigationState {
  /** Currently active module ID */
  currentModule: string;
  /** Currently active section ID */
  currentSection: string;
  /** Whether the sidebar is open (for mobile/tablet) */
  sidebarOpen: boolean;
  /** Breadcrumb trail for navigation */
  breadcrumbs: Breadcrumb[];
}

/**
 * Represents a breadcrumb item for navigation.
 */
export interface Breadcrumb {
  /** Display label for the breadcrumb */
  label: string;
  /** Route path for navigation */
  route: string;
  /** Whether this is the current/active breadcrumb */
  isActive: boolean;
}

/**
 * Represents search functionality state.
 */
export interface SearchState {
  /** Current search query */
  query: string;
  /** Search results */
  results: SearchResult[];
  /** Whether search is currently in progress */
  loading: boolean;
  /** Whether search results are visible */
  showResults: boolean;
}

/**
 * Represents a search result item.
 */
export interface SearchResult {
  /** Type of result (module or section) */
  type: 'module' | 'section';
  /** ID of the result item */
  id: string;
  /** Display title */
  title: string;
  /** Brief excerpt showing the match */
  excerpt: string;
  /** Module ID (for sections) */
  moduleId?: string;
  /** Route to navigate to this result */
  route: string;
  /** Relevance score for sorting */
  score: number;
}