import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mi-proyecto');
  protected darkMode = signal<boolean>(this.loadDarkMode());

  constructor() {
    this.applyTheme();
  }

  private loadDarkMode(): boolean {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return false;
  }

  toggleDarkMode() {
    this.darkMode.update(value => !value);
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode()));
    this.applyTheme();
  }

  private applyTheme() {
    const html = document.documentElement;
    if (this.darkMode()) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
    }
  }
}
