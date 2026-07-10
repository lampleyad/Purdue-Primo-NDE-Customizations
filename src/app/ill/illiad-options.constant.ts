// TODO: Replace placeholders below with Purdue's actual ILLiad configuration
// before deploying. See src/app/ill/README.md for details.
export const illiadOptions = {
  // Alma user group codes permitted to see the ILL pane, e.g. 'ALUM', 'UNDGRDUR'.
  groups: [] as string[], // TODO: add Purdue Alma user group codes here, e.g. ['ALUM', 'UNDGRDUR']
  // URL of the deployed PHP proxy (src/app/ill/server/illiad.php). See that
  // folder's README for deployment instructions.
  remoteScript: 'https://TODO-purdue-proxy-host/illiad.php',
  boxTitle: 'Interlibrary Loan',
  illiadURL: 'https://purdue.illiad.oclc.org/illiad/illiad.dll',
};
