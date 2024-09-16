import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dark-mode-toggle',
    templateUrl: './dark-mode-toggle.component.html',
    standalone: true,
    imports: [ CommonModule,FormsModule
  ],
})
export class DarkModeToggleComponent implements OnInit {
  isDarkMode: boolean = false;

  ngOnInit(): void {
    // Check for saved preference
    const savedPreference = localStorage.getItem('theme');
    if (savedPreference) {
      this.isDarkMode = savedPreference === 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
    }

    // Toggle 'dark' class on <html> element
    this.toggleDarkClass(this.isDarkMode);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.toggleDarkClass(this.isDarkMode);
  }

  toggleDarkClass(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
