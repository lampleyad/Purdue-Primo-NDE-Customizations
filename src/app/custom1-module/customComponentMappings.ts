import { HathiTrustComponent } from '../hathi-trust/hathi-trust.component';
import { IllQuickLinksComponent } from '../ill/ill-quick-links.component';

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-online-availability-before', HathiTrustComponent],
  // Parity with the legacy AngularJS ILL links (see src/app/ill/README.md).
  // The richer IllLoansOverviewComponent (inline request/article data) is
  // built but not wired here yet — it needs the PHP proxy in
  // src/app/ill/server/ deployed first.
  ['nde-account-overview-after', IllQuickLinksComponent],
]);
