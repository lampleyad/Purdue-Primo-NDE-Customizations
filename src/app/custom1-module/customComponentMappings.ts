import { HathiTrustComponent } from '../hathi-trust/hathi-trust.component';
import { IllQuickLinksComponent } from '../ill/ill-quick-links.component';
import { ReportProblemComponent } from '../report-problem/report-problem.component';

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-online-availability-before', HathiTrustComponent],
  // Parity with the legacy AngularJS ILL links (see src/app/ill/README.md).
  // The richer IllLoansOverviewComponent (inline request/article data) is
  // built but not wired here yet — it needs the PHP proxy in
  // src/app/ill/server/ deployed first.
  // Confirmed working (2026-07-10), but renders after all overview cards,
  // at the bottom of the page. nde-account-overview-before and
  // nde-account-overview-top were both tested and confirmed absent, so
  // there's currently no way to place this higher on the page via the
  // documented slot mechanism.
  ['nde-account-overview-after', IllQuickLinksComponent],
  // Adapted from watzek/watzek-primo-nde-customizations. Links to Purdue's
  // LibAnswers "Search and Access Support" queue (id 5651), pre-filled with
  // the current record's title/author/record ID and permalink.
  ['nde-full-display-service-container-before', ReportProblemComponent],
]);
