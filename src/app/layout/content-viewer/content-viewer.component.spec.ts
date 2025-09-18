import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ContentViewerComponent } from './content-viewer.component';
import { LearningSection } from '../../shared/interfaces/learning-module.interface';

describe('ContentViewerComponent', () => {
  let component: ContentViewerComponent;
  let fixture: ComponentFixture<ContentViewerComponent>;

  const mockSection: LearningSection = {
    id: 'introduction',
    title: 'Introduction to Angular',
    order: 1,
    content: 'Welcome to Angular! This is a comprehensive guide to learning Angular.',
    estimatedTime: '15 minutes',
    objectives: [
      'Understand what Angular is',
      'Learn about Angular architecture',
      'Set up your first Angular project'
    ],
    codeExamples: [
      {
        title: 'Hello World Component',
        language: 'typescript',
        code: `
@Component({
  selector: 'app-hello',
  template: '<h1>Hello World!</h1>'
})
export class HelloComponent { }
        `,
        explanation: 'This is a basic Angular component that displays "Hello World!"'
      }
    ],
    exercises: [
      {
        title: 'Create Your First Component',
        description: 'Create a component that displays your name',
        hints: ['Use the @Component decorator', 'Don\'t forget the template'],
        solution: 'ng generate component my-name'
      }
    ],
    nextSection: 'installation',
    previousSection: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentViewerComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('[data-testid="loading"]'));
    expect(loadingElement).toBeTruthy();
  });

  it('should display no content message when section is null', () => {
    component.section = null;
    component.loading = false;
    fixture.detectChanges();

    const noContentElement = fixture.debugElement.query(By.css('[data-testid="no-content"]'));
    expect(noContentElement).toBeTruthy();
    expect(noContentElement.nativeElement.textContent).toContain('Select a section');
  });

  it('should display section content', () => {
    component.section = mockSection;
    component.loading = false;
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toBe('Introduction to Angular');

    const contentElement = fixture.debugElement.query(By.css('.content-viewer__content p'));
    expect(contentElement.nativeElement.textContent).toBe(mockSection.content);
  });

  it('should display learning objectives', () => {
    component.section = mockSection;
    fixture.detectChanges();

    const objectivesList = fixture.debugElement.query(By.css('.content-viewer__objectives ul'));
    const objectives = objectivesList.queryAll(By.css('li'));

    expect(objectives.length).toBe(3);
    expect(objectives[0].nativeElement.textContent).toBe('Understand what Angular is');
  });

  it('should display code examples', () => {
    component.section = mockSection;
    fixture.detectChanges();

    const codeExample = fixture.debugElement.query(By.css('.content-viewer__code-example'));
    expect(codeExample).toBeTruthy();

    const codeTitle = codeExample.query(By.css('h4'));
    expect(codeTitle.nativeElement.textContent).toBe('Hello World Component');
  });

  it('should display exercises', () => {
    component.section = mockSection;
    fixture.detectChanges();

    const exercise = fixture.debugElement.query(By.css('.content-viewer__exercise'));
    expect(exercise).toBeTruthy();

    const exerciseTitle = exercise.query(By.css('h4'));
    expect(exerciseTitle.nativeElement.textContent).toBe('Create Your First Component');
  });

  it('should show/hide exercise hints', () => {
    component.section = mockSection;
    fixture.detectChanges();

    const toggleButton = fixture.debugElement.query(By.css('[data-testid="toggle-hints"]'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    const hints = fixture.debugElement.query(By.css('.content-viewer__exercise-hints'));
    expect(hints).toBeTruthy();
  });

  it('should show/hide exercise solution', () => {
    component.section = mockSection;
    fixture.detectChanges();

    const toggleButton = fixture.debugElement.query(By.css('[data-testid="toggle-solution"]'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    const solution = fixture.debugElement.query(By.css('.content-viewer__exercise-solution'));
    expect(solution).toBeTruthy();
  });

  it('should display estimated time', () => {
    component.section = mockSection;
    fixture.detectChanges();

    const timeElement = fixture.debugElement.query(By.css('.content-viewer__metadata'));
    expect(timeElement.nativeElement.textContent).toContain('15 minutes');
  });
});