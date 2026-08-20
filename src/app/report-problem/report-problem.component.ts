import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultFacade } from '../hathi-trust/primo-search-result/search-result.facade';

const LIBANSWERS_QUEUE_ID = '5651';
const LIBANSWERS_FORM_URL = 'https://answers.lib.purdue.edu/form';

// NDE occasionally mounts this remote slot more than once for the same
// record; only the first instance should render (same workaround needed
// for the ILL slot - see IllQuickLinksComponent notes).
const NDE_HOST_SELECTOR =
  'nde-full-display-service-container-before-from-remote-0';

@Component({
  selector: 'custom-report-problem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.scss'],
})
export class ReportProblemComponent implements OnInit {
  private searchResultFacade = inject(SearchResultFacade);
  private el = inject(ElementRef);

  ngOnInit(): void {
    this.searchResultFacade.currentFullDisplay$.subscribe(() => {
      this.hideDuplicateHost();
    });
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

  private hideDuplicateHost(): void {
    const hostNDE = this.el.nativeElement.closest(NDE_HOST_SELECTOR);
    if (!hostNDE) return;
    const allTargets = document.querySelectorAll(NDE_HOST_SELECTOR);
    const isFirst = allTargets[0] === hostNDE;
    if (!isFirst) {
      (hostNDE as HTMLElement).style.display = 'none';
    }
  }
}
