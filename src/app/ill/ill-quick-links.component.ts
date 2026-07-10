import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

// Parity with the legacy AngularJS `prmLoansOverviewAfter` component: static
// links out to ILLiad's own hosted pages. No ILLiad Web Platform API call,
// no API key, no server-side proxy required. See src/app/ill/README.md for
// the richer inline-data alternative (IllLoansOverviewComponent).
@Component({
  selector: 'ill-quick-links',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="ill-quick-links">
      <h2 class="ill-quick-links-title">Interlibrary Loan</h2>
      <a mat-stroked-button color="primary"
         href="https://purdue.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=66"
         target="_blank">View Items Checked Out</a>
      <a mat-stroked-button color="primary"
         href="https://purdue.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=64"
         target="_blank">View Items Available</a>
      <a mat-stroked-button color="primary"
         href="https://purdue.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=62"
         target="_blank">View Requests in Process</a>
    </div>
  `,
  styles: [`
    .ill-quick-links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 16px;
    }
    .ill-quick-links-title {
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0 0 8px;
    }
  `]
})
export class IllQuickLinksComponent {}
