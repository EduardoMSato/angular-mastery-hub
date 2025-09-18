import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContentService } from './content.service';
import { LearningModule, LearningSection } from '../../shared/interfaces/learning-module.interface';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentService]
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load modules', () => {
    const mockModules: LearningModule[] = [
      {
        id: 'getting-started',
        title: 'Getting Started',
        icon: 'play_arrow',
        order: 1,
        description: 'Start your Angular journey',
        sections: [],
        isAvailable: true,
        estimatedTime: '2 hours'
      }
    ];

    service.loadModules().subscribe(modules => {
      expect(modules).toEqual(mockModules);
    });

    const req = httpMock.expectOne('/assets/content/modules.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockModules);
  });

  it('should load a section', () => {
    const mockSection: LearningSection = {
      id: 'introduction',
      title: 'Introduction',
      order: 1,
      content: 'Welcome to Angular',
      estimatedTime: '10 minutes',
      objectives: ['Learn Angular basics'],
      codeExamples: [],
      exercises: [],
      nextSection: null,
      previousSection: null
    };

    service.loadSection('getting-started', 'introduction').subscribe(section => {
      expect(section).toEqual(mockSection);
    });

    const req = httpMock.expectOne('/assets/content/sections/getting-started/introduction.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSection);
  });

  it('should handle load section error', () => {
    service.loadSection('invalid', 'invalid').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('Section invalid not found');
      }
    });

    const req = httpMock.expectOne('/assets/content/sections/invalid/invalid.json');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should get current section', () => {
    const mockSection: LearningSection = {
      id: 'test',
      title: 'Test Section',
      order: 1,
      content: 'Test content',
      estimatedTime: '5 minutes',
      objectives: [],
      codeExamples: [],
      exercises: [],
      nextSection: null,
      previousSection: null
    };

    service.setCurrentSection(mockSection);

    service.getCurrentSection().subscribe(section => {
      expect(section).toEqual(mockSection);
    });
  });

  it('should get loading state', () => {
    service.getLoadingState().subscribe(loading => {
      expect(loading).toBe(false);
    });
  });
});