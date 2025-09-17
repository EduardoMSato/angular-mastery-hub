import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { GettingStartedComponent } from './getting-started.component';
import { ContentService } from '../../core/services/content.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LearningSection } from '../../shared/interfaces/learning-module.interface';

describe('GettingStartedComponent', () => {
  let component: GettingStartedComponent;
  let fixture: ComponentFixture<GettingStartedComponent>;
  let contentServiceSpy: jasmine.SpyObj<ContentService>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  const mockSection: LearningSection = {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    content: 'Welcome to Angular',
    estimatedTime: '10 minutes',
    objectives: [],
    codeExamples: [],
    exercises: [],
    nextSection: null,
    previousSection: null
  };

  beforeEach(async () => {
    const contentService = jasmine.createSpyObj('ContentService', ['loadSection', 'getCurrentSection', 'getLoadingState']);
    const navigationService = jasmine.createSpyObj('NavigationService', ['updateCurrentSection']);
    const activatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ sectionId: 'introduction' })
    });

    contentService.loadSection.and.returnValue(of(mockSection));
    contentService.getCurrentSection.and.returnValue(of(mockSection));
    contentService.getLoadingState.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [GettingStartedComponent],
      providers: [
        { provide: ContentService, useValue: contentService },
        { provide: NavigationService, useValue: navigationService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GettingStartedComponent);
    component = fixture.componentInstance;
    contentServiceSpy = TestBed.inject(ContentService) as jasmine.SpyObj<ContentService>;
    navigationServiceSpy = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load section on route parameter change', () => {
    component.ngOnInit();

    expect(contentServiceSpy.loadSection).toHaveBeenCalledWith('getting-started', 'introduction');
    expect(navigationServiceSpy.updateCurrentSection).toHaveBeenCalledWith('getting-started', 'introduction');
  });

  it('should update current section from content service', () => {
    component.ngOnInit();

    expect(component.currentSection).toEqual(mockSection);
  });

  it('should update loading state from content service', () => {
    contentServiceSpy.getLoadingState.and.returnValue(of(true));

    component.ngOnInit();

    expect(component.loading).toBe(true);
  });

  it('should handle load section error', () => {
    contentServiceSpy.loadSection.and.returnValue(throwError(() => new Error('Section not found')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Failed to load section:', jasmine.any(Error));
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should not load section if no sectionId in route params', () => {
    const route = TestBed.inject(ActivatedRoute);
    (route as any).params = of({});

    component.ngOnInit();

    expect(contentServiceSpy.loadSection).not.toHaveBeenCalled();
  });
});