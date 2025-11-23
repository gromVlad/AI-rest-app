import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StyleSelectorComponent } from '../styles/components/style-selector/style-selector';

@Component({
  selector: 'app-home',
  standalone: false,
  imports: [StyleSelectorComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  onStyleSelected(styleId: 'boxing' | 'muaythai' | 'mma'): void {
    // Navigate to the workout setup page with the selected style
    this.router.navigate(['/workout-setup'], { queryParams: { style: styleId } });
  }
}
