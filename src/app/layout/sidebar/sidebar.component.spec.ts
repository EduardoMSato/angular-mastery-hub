import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { ContentService } from '../../core/services/content.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LearningModule } from '../../shared/interfaces/learning-module.interface';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let contentServiceSpy: jasmine.SpyObj<ContentService>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;

  const mockModules: LearningModule[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'play_arrow',
      order: 1,
      description: 'Start your Angular journey',
      sections: [
        {
          id: 'introduction',
          title: 'Introduction',
          order: 1,
          content: 'Welcome',
          estimatedTime: '10 min',
          objectives: [],
          codeExamples: [],
          exercises: [],
          nextSection: null,
          previousSection: null
        }
      ],
      isAvailable: true,
      estimatedTime: '2 hours'
    }
  ];

  beforeEach(async () => {
    const contentService = jasmine.createSpyObj('ContentService', ['loadModules']);
    const navigationService = jasmine.createSpyObj('NavigationService', ['navigateToModule', 'navigateToSection', 'getCurrentModule']);

    contentService.loadModules.and.returnValue(of(mockModules));
    navigationService.getCurrentModule.and.returnValue(of('getting-started'));

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, NoopAnimationsModule],
      providers: [
        { provide: ContentService, useValue: contentService },
        { provide: NavigationService, useValue: navigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    contentServiceSpy = TestBed.inject(ContentService) as jasmine.SpyObj<ContentService>;
    navigationServiceSpy = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load modules on init', () => {
    expect(contentServiceSpy.loadModules).toHaveBeenCalled();
    expect(component.modules.length).toBe(1);
    expect(component.modules[0].title).toBe('Getting Started');
  });

  it('should navigate to module when module clicked', () => {
    component.onModuleClick(mockModules[0]);

    expect(navigationServiceSpy.navigateToModule).toHaveBeenCalledWith('getting-started');
  });

  it('should navigate to section when section clicked', () => {
    const section = mockModules[0].sections[0];
    component.onSectionClick('getting-started', section);

    expect(navigationServiceSpy.navigateToSection).toHaveBeenCalledWith('getting-started', 'introduction');
  });

  it('should toggle module expansion', () => {
    const moduleId = 'getting-started';
    expect(component.expandedModules.has(moduleId)).toBe(false);

    component.toggleModule(moduleId);
    expect(component.expandedModules.has(moduleId)).toBe(true);

    component.toggleModule(moduleId);
    expect(component.expandedModules.has(moduleId)).toBe(false);
  });

  it('should track current module', () => {
    navigationServiceSpy.getCurrentModule.and.returnValue(of('fundamentals'));
    fixture.detectChanges();

    expect(component.currentModule).toBe('fundamentals');
  });

  it('should apply correct CSS classes for open/closed sidebar', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const sidebar = fixture.debugElement.query(By.css('.sidebar'));
    expect(sidebar.nativeElement.classList.contains('sidebar--open')).toBe(true);

    component.isOpen = false;
    fixture.detectChanges();

    expect(sidebar.nativeElement.classList.contains('sidebar--open')).toBe(false);
  });
});