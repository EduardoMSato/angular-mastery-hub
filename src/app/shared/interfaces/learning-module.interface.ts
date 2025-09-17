/**
 * Represents a learning module in the Angular Mastery Hub curriculum.
 *
 * Learning modules are top-level organizational units that contain
 * multiple related sections. They appear in the sidebar navigation
 * and define the progressive learning path.
 */
export interface LearningModule {
  /** Unique identifier for the module */
  id: string;
  /** Display title for the module */
  title: string;
  /** Icon identifier (emoji or icon name) */
  icon: string;
  /** Display order in the navigation */
  order: number;
  /** Brief description of the module content */
  description: string;
  /** Array of learning sections within this module */
  sections: LearningSection[];
  /** Whether this module is available to users */
  isAvailable: boolean;
  /** Estimated time to complete the module */
  estimatedTime: string;
}

/**
 * Represents an individual learning section within a module.
 */
export interface LearningSection {
  /** Unique identifier for the section */
  id: string;
  /** ID of the parent module */
  moduleId: string;
  /** Display title for the section */
  title: string;
  /** Main content in markdown format */
  content: string;
  /** Interactive code examples */
  codeExamples: CodeExample[];
  /** Display order within the module */
  order: number;
  /** Search and categorization tags */
  tags: string[];
  /** Difficulty level for learner guidance */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Estimated time to complete this section */
  estimatedTime: string;
}

/**
 * Represents an interactive code example within a learning section.
 */
export interface CodeExample {
  /** Unique identifier for the code example */
  id: string;
  /** Display title for the example */
  title: string;
  /** Description of what this example demonstrates */
  description: string;
  /** The source code content */
  code: string;
  /** Programming language for syntax highlighting */
  language: 'typescript' | 'html' | 'scss' | 'javascript' | 'css';
  /** Whether users can edit this code example */
  isEditable: boolean;
  /** Detailed explanation of the code */
  explanation: string;
  /** Expected output or result */
  expectedOutput?: string;
}