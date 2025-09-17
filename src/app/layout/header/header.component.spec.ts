import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { ThemeService } from '../../core/services/theme.service';
import { NavigationService } from '../../core/services/navigation.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    const themeService = jasmine.createSpyObj('ThemeService', ['toggleTheme', 'isDarkTheme']);
    const navigationService = jasmine.createSpyObj('NavigationService', ['navigateToModule', 'getBreadcrumbs']);

    themeService.isDarkTheme.and.returnValue(of(false));
    navigationService.getBreadcrumbs.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NoopAnimationsModule],
      providers: [
        { provide: ThemeService, useValue: themeService },
        { provide: NavigationService, useValue: navigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    themeServiceSpy = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    navigationServiceSpy = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sidebar toggle event', () => {
    spyOn(component.sidebarToggle, 'emit');

    component.onSidebarToggle();

    expect(component.sidebarToggle.emit).toHaveBeenCalled();
  });

  it('should toggle theme', () => {
    component.onThemeToggle();

    expect(themeServiceSpy.toggleTheme).toHaveBeenCalled();
  });

  it('should navigate to home', () => {
    component.onHomeClick();

    expect(navigationServiceSpy.navigateToModule).toHaveBeenCalledWith('getting-started');
  });

  it('should display correct theme icon for light theme', () => {
    themeServiceSpy.isDarkTheme.and.returnValue(of(false));
    fixture.detectChanges();

    const themeButton = fixture.debugElement.query(By.css('[data-testid="theme-toggle"]'));
    const icon = themeButton.query(By.css('mat-icon'));

    expect(icon.nativeElement.textContent.trim()).toBe('dark_mode');
  });

  it('should display correct theme icon for dark theme', () => {
    themeServiceSpy.isDarkTheme.and.returnValue(of(true));
    fixture.detectChanges();

    const themeButton = fixture.debugElement.query(By.css('[data-testid="theme-toggle"]'));
    const icon = themeButton.query(By.css('mat-icon'));

    expect(icon.nativeElement.textContent.trim()).toBe('light_mode');
  });
});