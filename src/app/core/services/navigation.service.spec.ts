import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: spy }
      ]
    });
    service = TestBed.inject(NavigationService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to module', () => {
    service.navigateToModule('getting-started');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/getting-started']);
  });

  it('should navigate to section', () => {
    service.navigateToSection('getting-started', 'introduction');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/getting-started', 'introduction']);
  });

  it('should update current section and breadcrumbs', () => {
    service.updateCurrentSection('getting-started', 'introduction');

    service.getBreadcrumbs().subscribe(breadcrumbs => {
      expect(breadcrumbs).toEqual([
        { label: 'Home', url: '/' },
        { label: 'Getting Started', url: '/getting-started' },
        { label: 'Introduction', url: '/getting-started/introduction' }
      ]);
    });
  });

  it('should get breadcrumbs', () => {
    service.getBreadcrumbs().subscribe(breadcrumbs => {
      expect(breadcrumbs).toEqual([]);
    });
  });

  it('should get current module', () => {
    service.updateCurrentSection('fundamentals', 'basics');

    service.getCurrentModule().subscribe(module => {
      expect(module).toBe('fundamentals');
    });
  });

  it('should get current section', () => {
    service.updateCurrentSection('core-concepts', 'components');

    service.getCurrentSection().subscribe(section => {
      expect(section).toBe('components');
    });
  });
});