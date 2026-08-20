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

  reportUrl = `${LIBANSWERS_FORM_URL}?queue_id=${LIBANSWERS_QUEUE_ID}`;

  ngOnInit(): void {
    this.searchResultFacade.currentFullDisplay$.subscribe((record) => {
      const title = record?.pnx?.display?.['title']?.[0] ?? '';
      const author = record?.pnx?.display?.['creator']?.[0] ?? '';
      const docid = record?.pnx?.control?.recordid?.[0] ?? '';

      const detail = [title, author && `by ${author}`, docid && `(Record ID: ${docid})`]
        .filter(Boolean)
        .join(' ');

      const params = new URLSearchParams({
        queue_id: LIBANSWERS_QUEUE_ID,
        custom3: detail,
        pdetails: window.location.href,
      });
      this.reportUrl = `${LIBANSWERS_FORM_URL}?${params.toString()}`;

      this.hideDuplicateHost();
    });
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
