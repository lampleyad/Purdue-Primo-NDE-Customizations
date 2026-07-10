# HathiTrust Availability Component

NDE implementation of the [legacy Primo HathiTrust availability plugin](https://github.com/UMNLibraries/primo-explore-hathitrust-availability),
integrated from [lampleyad/primo-nde-hathi-trust-poc](https://github.com/lampleyad/primo-nde-hathi-trust-poc).

When a local (non-CDI) search result is displayed in Primo, the record's OCLC
numbers (or other optional identifiers) are passed to the
[HathiTrust Bib API](https://www.hathitrust.org/bib_api). If at least one item
with free full-text access is found, a link to the HathiTrust record is
appended to the availability section.

## Wiring

- Mapped to the `nde-online-availability-before` selector in
  `src/app/custom1-module/customComponentMappings.ts`.
- Requires `provideHttpClient()` and a `MODULE_PARAMETERS` provider, both set
  up in `src/app/app.module.ts`.

## Configuration options

Edit the `hathiTrustParameters` object in `src/app/app.module.ts`.

|Option|Type|Default|Description|
|------|----|-------|-----------|
|`disableWhenAvailableOnline`|boolean|true|Don't check for HathiTrust availability if the record already has online access.|
|`disableForJournals`|boolean|false|Don't check for HathiTrust availability if the record type is a journal.|
|`ignoreCopyright`|boolean|false|Display availability links on all records in HathiTrust, including works not in the public domain. Normally, you won't want to enable this unless [ETAS](https://www.hathitrust.org/member-libraries/services-programs/etas/) is in effect.|
|`matchOn.oclc`|boolean|true|Search HathiTrust using the record's OCLC number(s). This is usually the most reliable match point for HathiTrust records.|
|`matchOn.isbn`|boolean|false|Search HathiTrust using the record's ISBN(s).|
|`matchOn.issn`|boolean|false|Search HathiTrust using the record's ISSN(s).|

You can enable any combination of `matchOn` identifiers, as long as at least
one identifier is enabled.

## Customizing the availability text

The default availability link text is: "Full Text May be Available at HathiTrust"

To customize it, add a row to the Primo VE **NDE Custom Defined Labels** code
table with the code `HathiTrust.availabilityText` and a description of your
choosing.
