import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark-theme');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    service.isDarkTheme().subscribe(isDark => {
      expect(isDark).toBe(false);
    });
  });

  it('should toggle theme', () => {
    service.toggleTheme();

    service.isDarkTheme().subscribe(isDark => {
      expect(isDark).toBe(true);
    });

    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');

    const newService = new ThemeService(document);

    newService.isDarkTheme().subscribe(isDark => {
      expect(isDark).toBe(true);
    });

    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });

  it('should set dark theme', () => {
    service.setDarkTheme(true);

    service.isDarkTheme().subscribe(isDark => {
      expect(isDark).toBe(true);
    });

    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should set light theme', () => {
    service.setDarkTheme(true);
    service.setDarkTheme(false);

    service.isDarkTheme().subscribe(isDark => {
      expect(isDark).toBe(false);
    });

    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});