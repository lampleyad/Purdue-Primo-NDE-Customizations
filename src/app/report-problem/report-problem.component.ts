import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

const LIBANSWERS_QUEUE_ID = '5651';
const LIBANSWERS_FORM_URL = 'https://answers.lib.purdue.edu/form';

// NDE mounts this slot once per section container on the full-display page
// (title, requests, locations, details, etc. - more on FRBR/grouped records
// with several accordion sections), so multiple instances of this component
// exist simultaneously. Only the first one to initialize should render;
// everyone else stays hidden. A shared module-level flag (not a DOM
// selector/position comparison) is used because instances can mount at
// different times as accordion sections lazily render, which broke an
// earlier version of this dedup logic.
let claimed = false;

@Component({
  selector: 'custom-report-problem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.scss'],
})
export class ReportProblemComponent implements OnInit, OnDestroy {
  shouldShow = false;

  ngOnInit(): void {
    if (!claimed) {
      claimed = true;
      this.shouldShow = true;
    }
  }

  ngOnDestroy(): void {
    // Only the instance that actually claimed/displayed itself releases the
    // claim, so another (still-hidden) instance on the same page can't
    // sneak in and become visible too.
    if (this.shouldShow) {
      claimed = false;
    }
  }

  // A getter (not a value set once in ngOnInit) so the URL is always read
  // fresh from window.location.href at the moment Angular renders/re-renders
  // the link, rather than a snapshot that can go stale if NDE updates the
  // address bar (query params, etc.) after this component first mounts.
  get reportUrl(): string {
    const params = new URLSearchParams({
      queue_id: LIBANSWERS_QUEUE_ID,
      pdetails: window.location.href,
    });
    return `${LIBANSWERS_FORM_URL}?${params.toString()}`;
  }
}
