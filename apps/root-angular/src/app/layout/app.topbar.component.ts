import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];

  isDarkMode: boolean = true;

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    const savedPreference = localStorage.getItem('theme');
    if (savedPreference) {
      this.isDarkMode = savedPreference === 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
    }
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      this.changeTheme('bootstrap4-dark-blue', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      this.changeTheme('bootstrap4-light-blue', 'light');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      this.changeTheme('bootstrap4-dark-blue', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      this.changeTheme('bootstrap4-light-blue', 'light');
    }
    localStorage.setItem('theme', this.isDarkMode ? 'light' : 'dark');
  }

  set theme(val: string) {
    this.layoutService.config.update((config: any) => ({
      ...config,
      theme: val,
    }));
  }
  get theme(): string {
    return this.layoutService.config().theme;
  }

  set colorScheme(val: string) {
    this.layoutService.config.update((config: any) => ({
      ...config,
      colorScheme: val,
    }));
  }
  get colorScheme(): string {
    return this.layoutService.config().colorScheme;
  }

  changeTheme(theme: string, colorScheme: string) {
    this.theme = theme;
    this.colorScheme = colorScheme;
  }

  clearDashboard() {
    this.layoutService.clearDashBoard();
  }
}
