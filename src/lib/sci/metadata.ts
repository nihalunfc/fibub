// Metadata records for datasets, written to three standards:
// - Dublin Core: the 15 elements of the DCMI Metadata Element Set 1.1 (namespace http://purl.org/dc/elements/1.1/),
//   written as an OAI-PMH oai_dc record.
// - DataCite Metadata Schema 4.5 (namespace http://datacite.org/schema/kernel-4): its mandatory and recommended
//   properties and a few optional ones, as DataCite XML and as DataCite JSON (the form of the DataCite REST API).
// - Darwin Core (TDWG, namespace http://rs.tdwg.org/dwc/terms/) occurrence terms, as Simple Darwin Core XML, JSON and
//   an occurrence-core CSV row.
// Term names, vocabularies and namespaces are the standards' own. Checks: required fields, ISO 8601 dates and
// intervals, ORCID iD check digits (ISO 7064 MOD 11-2), DOI form, latitude and longitude ranges. No DOM.

export type Kind = 'text' | 'long' | 'date' | 'year' | 'select' | 'lines' | 'list' | 'lat' | 'lon' | 'doi' | 'url' | 'int' | 'num' | 'lang' | 'country' | 'orcid';
export type Field = { id: string; label: string; help: string; req: 'required' | 'recommended' | 'optional'; kind: Kind; options?: string[]; placeholder?: string; group?: string };
export type Values = Record<string, string>;
export type Issue = { id: string; level: 'error' | 'warn'; msg: string };
export type SchemaId = 'dc' | 'datacite' | 'dwc';

// ---------- checks ----------
/** ORCID iD: 16 characters, the last a check digit (0-9 or X) by ISO 7064 MOD 11-2. Accepts the https://orcid.org/ form. */
export function orcidOk(s: string): boolean {
  const m = s.trim().replace(/^https?:\/\/(www\.)?orcid\.org\//i, '').match(/^(\d{4})-?(\d{4})-?(\d{4})-?(\d{3}[\dX])$/i);
  if (!m) return false;
  const d = (m[1] + m[2] + m[3] + m[4]).toUpperCase();
  let t = 0;
  for (let i = 0; i < 15; i++) t = (t + Number(d[i])) * 2;
  const r = (12 - (t % 11)) % 11;
  return d[15] === (r === 10 ? 'X' : String(r));
}
export const orcidUrl = (s: string) => { const d = s.trim().replace(/^https?:\/\/(www\.)?orcid\.org\//i, '').replace(/-/g, '').toUpperCase(); return `https://orcid.org/${d.slice(0, 4)}-${d.slice(4, 8)}-${d.slice(8, 12)}-${d.slice(12)}`; };

/** A DOI as 10.prefix/suffix (doi: and https://doi.org/ forms are accepted and stripped). */
export const doiBare = (s: string) => s.trim().replace(/^(doi:|https?:\/\/(dx\.)?doi\.org\/)/i, '');
export const doiOk = (s: string) => /^10\.\d{4,9}\/\S+$/.test(doiBare(s));

const leap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
/** One ISO 8601 calendar date or date-time: YYYY, YYYY-MM, YYYY-MM-DD, or YYYY-MM-DDThh:mm[:ss[.s]][Z|±hh:mm]. */
export function isoOne(s: string): boolean {
  const m = s.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:[.,]\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)?)?)?)?$/);
  if (!m) return false;
  const [, , mo, d, h, mi, se, tz] = m, y = Number(m[1]);
  if (mo !== undefined && !(+mo >= 1 && +mo <= 12)) return false;
  if (d !== undefined) { const dim = [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][+mo - 1]; if (!(+d >= 1 && +d <= dim)) return false; }
  if (h !== undefined && !(+h <= 23 || (+h === 24 && +mi === 0 && !(se && +se)))) return false;
  if (mi !== undefined && +mi > 59) return false;
  if (se !== undefined && +se > 59) return false;
  if (tz && tz !== 'Z') { const t = tz.slice(1).replace(':', ''); if (+t.slice(0, 2) > 14 || (t.length > 2 && +t.slice(2) > 59)) return false; }
  return true;
}
/** A date, or an interval start/end (either side may be open with ".." or empty, as Darwin Core and DataCite allow
 * "2026-03-01/2026-03-05"). The end must not be before the start when both are full dates. */
export function isoDate(s: string): boolean {
  const t = s.trim();
  if (!t.includes('/')) return isoOne(t);
  const [a, b, ...rest] = t.split('/');
  if (rest.length) return false;
  const okA = a === '' || a === '..' || isoOne(a), okB = b === '' || b === '..' || isoOne(b) || /^\d{2}(-\d{2})?$/.test(b);
  if (!okA || !okB || (a === '' || a === '..') && (b === '' || b === '..')) return false;
  if (isoOne(a) && isoOne(b) && b.length >= a.length && b.slice(0, a.length) < a) return false;
  return true;
}
const latOk = (s: string) => /^[+-]?\d+(\.\d+)?$/.test(s.trim()) && Math.abs(Number(s)) <= 90;
const lonOk = (s: string) => /^[+-]?\d+(\.\d+)?$/.test(s.trim()) && Math.abs(Number(s)) <= 180;
const urlOk = (s: string) => /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(s.trim());
const langOk = (s: string) => /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(s.trim());

// ---------- vocabularies (the standards' own term values) ----------
export const DCMI_TYPES = ['Collection', 'Dataset', 'Event', 'Image', 'InteractiveResource', 'MovingImage', 'PhysicalObject', 'Service', 'Software', 'Sound', 'StillImage', 'Text'];
export const DC_RESOURCE_TYPES = ['Audiovisual', 'Book', 'BookChapter', 'Collection', 'ComputationalNotebook', 'ConferencePaper', 'ConferenceProceeding', 'DataPaper', 'Dataset', 'Dissertation', 'Event', 'Image', 'Instrument', 'InteractiveResource', 'Journal', 'JournalArticle', 'Model', 'OutputManagementPlan', 'PeerReview', 'PhysicalObject', 'Preprint', 'Report', 'Service', 'Software', 'Sound', 'Standard', 'StudyRegistration', 'Text', 'Workflow', 'Other'];
export const DC_DATE_TYPES = ['Accepted', 'Available', 'Copyrighted', 'Collected', 'Created', 'Issued', 'Submitted', 'Updated', 'Valid', 'Withdrawn', 'Other'];
export const DC_CONTRIB_TYPES = ['ContactPerson', 'DataCollector', 'DataCurator', 'DataManager', 'Distributor', 'Editor', 'HostingInstitution', 'Producer', 'ProjectLeader', 'ProjectManager', 'ProjectMember', 'RegistrationAgency', 'RegistrationAuthority', 'RelatedPerson', 'Researcher', 'ResearchGroup', 'RightsHolder', 'Sponsor', 'Supervisor', 'WorkPackageLeader', 'Other'];
export const DC_RELATION_TYPES = ['IsCitedBy', 'Cites', 'IsCollectedBy', 'Collects', 'IsSupplementTo', 'IsSupplementedBy', 'IsContinuedBy', 'Continues', 'IsDescribedBy', 'Describes', 'HasMetadata', 'IsMetadataFor', 'HasVersion', 'IsVersionOf', 'IsNewVersionOf', 'IsPartOf', 'IsPreviousVersionOf', 'IsPublishedIn', 'HasPart', 'IsReferencedBy', 'References', 'IsDocumentedBy', 'Documents', 'IsCompiledBy', 'Compiles', 'IsVariantFormOf', 'IsOriginalFormOf', 'IsIdenticalTo', 'IsReviewedBy', 'Reviews', 'IsDerivedFrom', 'IsSourceOf', 'IsRequiredBy', 'Requires', 'IsObsoletedBy', 'Obsoletes'];
export const DC_RELID_TYPES = ['ARK', 'arXiv', 'bibcode', 'DOI', 'EAN13', 'EISSN', 'Handle', 'IGSN', 'ISBN', 'ISSN', 'ISTC', 'LISSN', 'LSID', 'PMID', 'PURL', 'UPC', 'URL', 'URN', 'w3id'];
export const BASIS = ['HumanObservation', 'MachineObservation', 'PreservedSpecimen', 'LivingSpecimen', 'FossilSpecimen', 'MaterialSample', 'MaterialEntity', 'MaterialCitation', 'Occurrence'];
export const RANKS = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'subspecies', 'variety', 'form'];
export const KINGDOMS = ['Animalia', 'Plantae', 'Fungi', 'Chromista', 'Protozoa', 'Bacteria', 'Archaea', 'Viruses'];
/** Licences by their SPDX identifiers. */
export const LICENCES: { id: string; name: string; url: string }[] = [
  { id: 'CC-BY-4.0', name: 'Creative Commons Attribution 4.0 International', url: 'https://creativecommons.org/licenses/by/4.0/legalcode' },
  { id: 'CC0-1.0', name: 'Creative Commons Zero v1.0 Universal', url: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode' },
  { id: 'CC-BY-SA-4.0', name: 'Creative Commons Attribution Share Alike 4.0 International', url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode' },
  { id: 'CC-BY-NC-4.0', name: 'Creative Commons Attribution Non Commercial 4.0 International', url: 'https://creativecommons.org/licenses/by-nc/4.0/legalcode' },
  { id: 'ODbL-1.0', name: 'Open Data Commons Open Database License v1.0', url: 'https://opendatacommons.org/licenses/odbl/1-0/' },
  { id: 'PDDL-1.0', name: 'Open Data Commons Public Domain Dedication & License 1.0', url: 'https://opendatacommons.org/licenses/pddl/1-0/' },
  { id: 'MIT', name: 'MIT License', url: 'https://opensource.org/license/mit/' },
  { id: 'Apache-2.0', name: 'Apache License 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
];

// ---------- the forms ----------
const lic = ['', ...LICENCES.map((l) => l.id)];
export const SCHEMAS: Record<SchemaId, { name: string; ref: string; note: string; fields: Field[] }> = {
  dc: {
    name: 'Dublin Core', ref: 'DCMI Metadata Element Set, version 1.1 (dublincore.org)',
    note: 'Dublin Core makes every element optional and repeatable. This page asks for title, creator, date and identifier so the record is useful; the rest are recommended where they apply.',
    fields: [
      { id: 'title', label: 'title', help: 'The name of the dataset.', req: 'required', kind: 'text' },
      { id: 'creator', label: 'creator', help: 'Who made it, one per line (people as "Family, Given").', req: 'required', kind: 'lines', placeholder: 'Rivera, Ana\nOkafor, Chidi' },
      { id: 'subject', label: 'subject', help: 'Keywords, separated by commas.', req: 'recommended', kind: 'list' },
      { id: 'description', label: 'description', help: 'What the data are, in a few sentences.', req: 'recommended', kind: 'long' },
      { id: 'publisher', label: 'publisher', help: 'Who makes it available (often the repository or institution).', req: 'recommended', kind: 'text' },
      { id: 'contributor', label: 'contributor', help: 'Others who helped, one per line.', req: 'optional', kind: 'lines' },
      { id: 'date', label: 'date', help: 'ISO 8601: 2026, 2026-03 or 2026-03-14; an interval as start/end.', req: 'required', kind: 'date' },
      { id: 'type', label: 'type', help: 'From the DCMI Type Vocabulary.', req: 'recommended', kind: 'select', options: ['', ...DCMI_TYPES] },
      { id: 'format', label: 'format', help: 'File formats as media types, separated by commas (text/csv, application/x-netcdf).', req: 'recommended', kind: 'list' },
      { id: 'identifier', label: 'identifier', help: 'A DOI (10.xxxx/...) or a web address.', req: 'required', kind: 'text' },
      { id: 'source', label: 'source', help: 'A resource this one is derived from.', req: 'optional', kind: 'text' },
      { id: 'language', label: 'language', help: 'Language code (BCP 47), such as en or fr-CA.', req: 'recommended', kind: 'lang' },
      { id: 'relation', label: 'relation', help: 'Related resources (papers, other datasets), one per line.', req: 'optional', kind: 'lines' },
      { id: 'coverage', label: 'coverage', help: 'Where and when: a place name, coordinates or a period.', req: 'recommended', kind: 'text' },
      { id: 'rights', label: 'rights', help: 'Licence or rights statement. Pick a licence or type your own.', req: 'recommended', kind: 'text', options: lic },
    ],
  },
  datacite: {
    name: 'DataCite', ref: 'DataCite Metadata Schema 4.5 (schema.datacite.org)',
    note: 'DataCite\'s six mandatory properties are marked required; the recommended ones help people find and cite the data. If your repository will assign the DOI, use the one it reserves for you.',
    fields: [
      { id: 'doi', label: 'Identifier (DOI)', help: 'The DOI, as 10.prefix/suffix.', req: 'required', kind: 'doi', group: 'Mandatory' },
      { id: 'creators', label: 'Creators', help: 'One per line: "Family, Given; ORCID iD; Affiliation". A line with no comma is taken as an organisation.', req: 'required', kind: 'lines', placeholder: 'Rivera, Ana; 0000-0002-1825-0097; River Institute' },
      { id: 'title', label: 'Title', help: 'The main title.', req: 'required', kind: 'text' },
      { id: 'subtitle', label: 'Subtitle', help: 'Optional; written as a title with titleType Subtitle.', req: 'optional', kind: 'text' },
      { id: 'publisher', label: 'Publisher', help: 'The repository or organisation that holds and publishes the data.', req: 'required', kind: 'text' },
      { id: 'publicationYear', label: 'Publication year', help: 'Four digits, the year the DOI is made public.', req: 'required', kind: 'year' },
      { id: 'resourceTypeGeneral', label: 'Resource type (general)', help: 'From DataCite\'s list.', req: 'required', kind: 'select', options: ['', ...DC_RESOURCE_TYPES] },
      { id: 'resourceType', label: 'Resource type (your words)', help: 'Optional detail, such as "Water quality survey".', req: 'optional', kind: 'text' },
      { id: 'subjects', label: 'Subjects', help: 'Keywords, separated by commas.', req: 'recommended', kind: 'list', group: 'Recommended' },
      { id: 'contributors', label: 'Contributors', help: 'One per line: "Type: Family, Given; ORCID iD; Affiliation". Types: ' + DC_CONTRIB_TYPES.join(', ') + '.', req: 'recommended', kind: 'lines', placeholder: 'ContactPerson: Okafor, Chidi; ; River Institute' },
      { id: 'dates', label: 'Dates', help: 'One per line: "Type: date", ISO 8601, intervals as start/end. Types: ' + DC_DATE_TYPES.join(', ') + '.', req: 'recommended', kind: 'lines', placeholder: 'Collected: 2026-03-01/2026-03-05' },
      { id: 'relatedIdentifiers', label: 'Related identifiers', help: 'One per line: "Relation IdentifierType identifier", such as "IsSupplementTo DOI 10.5555/12345678".', req: 'recommended', kind: 'lines' },
      { id: 'abstract', label: 'Description: abstract', help: 'What the data are.', req: 'recommended', kind: 'long' },
      { id: 'methods', label: 'Description: methods', help: 'How they were collected and processed.', req: 'recommended', kind: 'long' },
      { id: 'geoPlace', label: 'Place', help: 'A place name for the data.', req: 'recommended', kind: 'text' },
      { id: 'geoLat', label: 'Point latitude', help: 'Decimal degrees, −90 to 90.', req: 'recommended', kind: 'lat' },
      { id: 'geoLon', label: 'Point longitude', help: 'Decimal degrees, −180 to 180.', req: 'recommended', kind: 'lon' },
      { id: 'language', label: 'Language', help: 'Language code (BCP 47), such as en.', req: 'optional', kind: 'lang', group: 'Optional' },
      { id: 'version', label: 'Version', help: 'Such as 1.0.', req: 'optional', kind: 'text' },
      { id: 'rights', label: 'Rights (licence)', help: 'Written with its SPDX identifier and link.', req: 'optional', kind: 'select', options: lic },
      { id: 'formats', label: 'Formats', help: 'Separated by commas, such as text/csv.', req: 'optional', kind: 'list' },
      { id: 'sizes', label: 'Sizes', help: 'Separated by commas, such as "12 files, 3 MB".', req: 'optional', kind: 'list' },
      { id: 'funding', label: 'Funding', help: 'One per line: "Funder name; award number; award title".', req: 'optional', kind: 'lines' },
    ],
  },
  dwc: {
    name: 'Darwin Core', ref: 'Darwin Core terms (TDWG, dwc.tdwg.org)',
    note: 'One occurrence record (one organism or group seen or collected at one place and time). The four required terms are the ones biodiversity data portals ask for in every occurrence; the recommended ones make the record usable on a map.',
    fields: [
      { id: 'occurrenceID', label: 'occurrenceID', help: 'A unique, lasting identifier for this record.', req: 'required', kind: 'text', group: 'Record' },
      { id: 'basisOfRecord', label: 'basisOfRecord', help: 'What the record is based on.', req: 'required', kind: 'select', options: ['', ...BASIS] },
      { id: 'scientificName', label: 'scientificName', help: 'The full name, with authorship if you know it.', req: 'required', kind: 'text', group: 'Taxon' },
      { id: 'kingdom', label: 'kingdom', help: 'Helps match the name to the right group.', req: 'recommended', kind: 'select', options: ['', ...KINGDOMS] },
      { id: 'taxonRank', label: 'taxonRank', help: 'The rank of scientificName.', req: 'recommended', kind: 'select', options: ['', ...RANKS] },
      { id: 'eventDate', label: 'eventDate', help: 'ISO 8601 date or interval, such as 2026-05-14 or 2026-05-14/2026-05-16.', req: 'required', kind: 'date', group: 'Event' },
      { id: 'recordedBy', label: 'recordedBy', help: 'Who recorded it; several names separated by " | ".', req: 'recommended', kind: 'text' },
      { id: 'individualCount', label: 'individualCount', help: 'How many individuals (a whole number).', req: 'recommended', kind: 'int' },
      { id: 'occurrenceStatus', label: 'occurrenceStatus', help: 'present, or absent for a search that found none.', req: 'recommended', kind: 'select', options: ['', 'present', 'absent'] },
      { id: 'samplingProtocol', label: 'samplingProtocol', help: 'The method, such as "point count, 10 min".', req: 'optional', kind: 'text' },
      { id: 'decimalLatitude', label: 'decimalLatitude', help: 'Decimal degrees, −90 to 90.', req: 'recommended', kind: 'lat', group: 'Location' },
      { id: 'decimalLongitude', label: 'decimalLongitude', help: 'Decimal degrees, −180 to 180.', req: 'recommended', kind: 'lon' },
      { id: 'geodeticDatum', label: 'geodeticDatum', help: 'The datum of the coordinates; GPS gives WGS84 (EPSG:4326).', req: 'recommended', kind: 'text' },
      { id: 'coordinateUncertaintyInMeters', label: 'coordinateUncertaintyInMeters', help: 'Radius in metres that contains the true place (more than 0).', req: 'recommended', kind: 'num' },
      { id: 'countryCode', label: 'countryCode', help: 'Two letters, ISO 3166-1 alpha-2, such as CA or IN.', req: 'recommended', kind: 'country' },
      { id: 'stateProvince', label: 'stateProvince', help: 'State, province or region.', req: 'optional', kind: 'text' },
      { id: 'locality', label: 'locality', help: 'The place in words.', req: 'recommended', kind: 'text' },
      { id: 'institutionCode', label: 'institutionCode', help: 'The institution holding the record or specimen.', req: 'optional', kind: 'text', group: 'Record keeping' },
      { id: 'collectionCode', label: 'collectionCode', help: 'The collection or dataset within it.', req: 'optional', kind: 'text' },
      { id: 'catalogNumber', label: 'catalogNumber', help: 'The specimen or record number.', req: 'optional', kind: 'text' },
      { id: 'license', label: 'license (dcterms)', help: 'The licence for the record.', req: 'recommended', kind: 'select', options: lic },
      { id: 'rightsHolder', label: 'rightsHolder (dcterms)', help: 'Who owns the rights.', req: 'optional', kind: 'text' },
    ],
  },
};

const lines = (s = '') => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const list = (s = '') => s.split(',').map((l) => l.trim()).filter(Boolean);

type Person = { name: string; nameType: 'Personal' | 'Organizational'; givenName?: string; familyName?: string; orcid?: string; affiliation?: string };
function person(line: string): Person {
  const [nm, orcid, aff] = line.split(';').map((x) => x.trim());
  const p: Person = { name: nm, nameType: nm.includes(',') ? 'Personal' : 'Organizational' };
  if (p.nameType === 'Personal') { const [f, g] = nm.split(',').map((x) => x.trim()); p.familyName = f; if (g) p.givenName = g; }
  if (orcid) p.orcid = orcid;
  if (aff) p.affiliation = aff;
  return p;
}

/** Every problem with the values: errors (must fix) and warnings (should look at). */
export function validate(schema: SchemaId, v: Values): Issue[] {
  const out: Issue[] = [], S = SCHEMAS[schema];
  const err = (id: string, msg: string) => out.push({ id, level: 'error', msg });
  const warn = (id: string, msg: string) => out.push({ id, level: 'warn', msg });
  for (const f of S.fields) {
    const val = (v[f.id] ?? '').trim();
    if (!val) { if (f.req === 'required') err(f.id, `${f.label} is required.`); continue; }
    switch (f.kind) {
      case 'date': if (!isoDate(val)) err(f.id, `${f.label}: "${val}" is not an ISO 8601 date (YYYY-MM-DD, or start/end for an interval).`); break;
      case 'year': if (!/^\d{4}$/.test(val)) err(f.id, `${f.label}: give four digits, such as 2026.`); break;
      case 'lat': if (!latOk(val)) err(f.id, `${f.label}: latitude must be a number from −90 to 90.`); break;
      case 'lon': if (!lonOk(val)) err(f.id, `${f.label}: longitude must be a number from −180 to 180.`); break;
      case 'doi': if (!doiOk(val)) err(f.id, `${f.label}: a DOI looks like 10.1234/abc (10., then 4 to 9 digits, a slash and the rest).`); break;
      case 'int': if (!/^\d+$/.test(val)) err(f.id, `${f.label}: a whole number, 0 or more.`); break;
      case 'num': if (!(Number(val) > 0)) err(f.id, `${f.label}: a number greater than 0.`); break;
      case 'lang': if (!langOk(val)) err(f.id, `${f.label}: a language code such as en, fr or pt-BR.`); break;
      case 'country': if (!/^[A-Z]{2}$/.test(val)) err(f.id, `${f.label}: two capital letters, such as CA, IN or GB.`); break;
      case 'select': if (f.options && !f.options.includes(val)) err(f.id, `${f.label}: "${val}" is not one of the allowed values.`); break;
    }
  }
  if (schema === 'dc') {
    const id = (v.identifier ?? '').trim();
    if (id && !doiOk(id) && !urlOk(id)) warn('identifier', 'identifier: use a DOI or a full web address (https://...) so it can be resolved.');
    if (v.date && isoDate(v.date) && Number(v.date.slice(0, 4)) > new Date().getUTCFullYear() + 1) warn('date', 'date: this is in the future.');
  }
  if (schema === 'datacite') {
    lines(v.creators).forEach((l, i) => { const p = person(l); if (p.orcid && !orcidOk(p.orcid)) err('creators', `Creators line ${i + 1}: "${p.orcid}" is not a valid ORCID iD (check the digits; the last one is a check digit).`); if (p.nameType === 'Personal' && !p.givenName) warn('creators', `Creators line ${i + 1}: give "Family, Given" for a person.`); });
    lines(v.contributors).forEach((l, i) => {
      const m = l.match(/^(\w+)\s*:\s*(.+)$/);
      if (!m || !DC_CONTRIB_TYPES.includes(m[1])) { err('contributors', `Contributors line ${i + 1}: start with a contributor type and a colon, such as "ContactPerson: Okafor, Chidi".`); return; }
      const p = person(m[2]); if (p.orcid && !orcidOk(p.orcid)) err('contributors', `Contributors line ${i + 1}: "${p.orcid}" is not a valid ORCID iD.`);
    });
    lines(v.dates).forEach((l, i) => {
      const m = l.match(/^(\w+)\s*:\s*(.+)$/);
      if (!m || !DC_DATE_TYPES.includes(m[1])) err('dates', `Dates line ${i + 1}: start with a date type and a colon, such as "Collected: 2026-03-01".`);
      else if (!isoDate(m[2].trim())) err('dates', `Dates line ${i + 1}: "${m[2].trim()}" is not an ISO 8601 date or interval.`);
    });
    lines(v.relatedIdentifiers).forEach((l, i) => {
      const [rel, typ, ...rest] = l.split(/\s+/), id = rest.join(' ');
      if (!DC_RELATION_TYPES.includes(rel)) err('relatedIdentifiers', `Related identifiers line ${i + 1}: "${rel}" is not a DataCite relation type (such as IsSupplementTo, References, IsDerivedFrom).`);
      else if (!DC_RELID_TYPES.includes(typ)) err('relatedIdentifiers', `Related identifiers line ${i + 1}: "${typ ?? ''}" is not an identifier type (such as DOI, URL, Handle).`);
      else if (!id) err('relatedIdentifiers', `Related identifiers line ${i + 1}: the identifier is missing.`);
      else if (typ === 'DOI' && !doiOk(id)) err('relatedIdentifiers', `Related identifiers line ${i + 1}: "${id}" is not a DOI.`);
      else if (typ === 'URL' && !urlOk(id)) err('relatedIdentifiers', `Related identifiers line ${i + 1}: "${id}" is not a web address.`);
    });
    if (!!(v.geoLat ?? '').trim() !== !!(v.geoLon ?? '').trim()) err((v.geoLat ?? '').trim() ? 'geoLon' : 'geoLat', 'A point needs both latitude and longitude.');
    lines(v.funding).forEach((l, i) => { if (!l.split(';')[0].trim()) err('funding', `Funding line ${i + 1}: the funder name comes first.`); });
    if (v.publicationYear && /^\d{4}$/.test(v.publicationYear) && +v.publicationYear > new Date().getUTCFullYear() + 1) warn('publicationYear', 'Publication year is more than a year ahead.');
  }
  if (schema === 'dwc') {
    const la = (v.decimalLatitude ?? '').trim(), lo = (v.decimalLongitude ?? '').trim();
    if (!!la !== !!lo) err(la ? 'decimalLongitude' : 'decimalLatitude', 'Coordinates need both decimalLatitude and decimalLongitude.');
    if (la && lo) {
      if (!(v.geodeticDatum ?? '').trim()) warn('geodeticDatum', 'geodeticDatum: say which datum the coordinates use (WGS84 for GPS).');
      if (!(v.coordinateUncertaintyInMeters ?? '').trim()) warn('coordinateUncertaintyInMeters', 'coordinateUncertaintyInMeters: say how precise the coordinates are.');
      if (Number(la) === 0 && Number(lo) === 0) warn('decimalLatitude', 'Coordinates 0, 0 are in the Atlantic Ocean; often a sign of missing values.');
    }
    if (v.occurrenceStatus === 'absent' && v.individualCount && Number(v.individualCount) > 0) err('individualCount', 'An absent record cannot have a count above 0.');
    if (v.eventDate && isoDate(v.eventDate) && v.eventDate.slice(0, 10) > new Date().toISOString().slice(0, 10)) warn('eventDate', 'eventDate is in the future.');
  }
  return out;
}

// ---------- output ----------
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const el = (tag: string, text: string, attrs: Record<string, string | undefined> = {}, ind = '  ') => `${ind}<${tag}${Object.entries(attrs).filter(([, a]) => a !== undefined && a !== '').map(([k, a]) => ` ${k}="${esc(a!)}"`).join('')}>${esc(text)}</${tag}>`;
const licence = (id: string) => LICENCES.find((l) => l.id === id);

/** Dublin Core as { element: [values] }. */
export function dcRecord(v: Values): [string, string[]][] {
  const multi: Record<string, (s: string) => string[]> = { creator: lines, contributor: lines, relation: lines, subject: list, format: list };
  return SCHEMAS.dc.fields.map((f) => {
    const raw = (v[f.id] ?? '').trim();
    let vals = multi[f.id] ? multi[f.id](raw) : raw ? [raw] : [];
    if (f.id === 'rights' && licence(raw)) vals = [`${licence(raw)!.name} (${raw}), ${licence(raw)!.url}`];
    return [f.id, vals] as [string, string[]];
  }).filter(([, vals]) => vals.length);
}

/** DataCite JSON, as in the DataCite Metadata Schema 4.5 JSON form (the REST API "attributes"). */
export function dataciteJson(v: Values): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const t = (k: string) => (v[k] ?? '').trim();
  const who = (p: Person) => ({
    name: p.name, nameType: p.nameType,
    ...(p.givenName ? { givenName: p.givenName } : {}), ...(p.familyName ? { familyName: p.familyName } : {}),
    ...(p.orcid ? { nameIdentifiers: [{ nameIdentifier: orcidOk(p.orcid) ? orcidUrl(p.orcid) : p.orcid, nameIdentifierScheme: 'ORCID', schemeUri: 'https://orcid.org' }] } : {}),
    ...(p.affiliation ? { affiliation: [{ name: p.affiliation }] } : {}),
  });
  if (t('doi')) out.doi = doiBare(t('doi'));
  out.types = { resourceTypeGeneral: t('resourceTypeGeneral') || 'Dataset', ...(t('resourceType') ? { resourceType: t('resourceType') } : {}) };
  out.creators = lines(v.creators).map((l) => who(person(l)));
  out.titles = [{ title: t('title') }, ...(t('subtitle') ? [{ title: t('subtitle'), titleType: 'Subtitle' }] : [])];
  out.publisher = { name: t('publisher') };
  out.publicationYear = t('publicationYear');
  if (list(v.subjects).length) out.subjects = list(v.subjects).map((s) => ({ subject: s }));
  const contrib = lines(v.contributors).map((l) => l.match(/^(\w+)\s*:\s*(.+)$/)).filter(Boolean).map((m) => ({ ...who(person(m![2])), contributorType: m![1] }));
  if (contrib.length) out.contributors = contrib;
  const dates = lines(v.dates).map((l) => l.match(/^(\w+)\s*:\s*(.+)$/)).filter(Boolean).map((m) => ({ date: m![2].trim(), dateType: m![1] }));
  if (dates.length) out.dates = dates;
  if (t('language')) out.language = t('language');
  const rel = lines(v.relatedIdentifiers).map((l) => l.split(/\s+/)).filter((p) => p.length >= 3).map(([r, ty, ...id]) => ({ relatedIdentifier: ty === 'DOI' ? doiBare(id.join(' ')) : id.join(' '), relatedIdentifierType: ty, relationType: r }));
  if (rel.length) out.relatedIdentifiers = rel;
  if (list(v.sizes).length) out.sizes = list(v.sizes);
  if (list(v.formats).length) out.formats = list(v.formats);
  if (t('version')) out.version = t('version');
  const L = licence(t('rights'));
  if (L) out.rightsList = [{ rights: L.name, rightsUri: L.url, rightsIdentifier: L.id, rightsIdentifierScheme: 'SPDX', schemeUri: 'https://spdx.org/licenses/' }];
  const desc = [['abstract', 'Abstract'], ['methods', 'Methods']].filter(([k]) => t(k)).map(([k, d]) => ({ description: t(k), descriptionType: d }));
  if (desc.length) out.descriptions = desc;
  if (t('geoPlace') || (t('geoLat') && t('geoLon'))) out.geoLocations = [{ ...(t('geoPlace') ? { geoLocationPlace: t('geoPlace') } : {}), ...(t('geoLat') && t('geoLon') ? { geoLocationPoint: { pointLongitude: Number(t('geoLon')), pointLatitude: Number(t('geoLat')) } } : {}) }];
  const fund = lines(v.funding).map((l) => l.split(';').map((x) => x.trim())).filter((p) => p[0]).map(([n, a, ti]) => ({ funderName: n, ...(a ? { awardNumber: a } : {}), ...(ti ? { awardTitle: ti } : {}) }));
  if (fund.length) out.fundingReferences = fund;
  out.schemaVersion = 'http://datacite.org/schema/kernel-4';
  return out;
}

/** Darwin Core: [term, namespace prefix, value] for each filled term. */
export function dwcRecord(v: Values): [string, string, string][] {
  return SCHEMAS.dwc.fields.filter((f) => (v[f.id] ?? '').trim()).map((f) => {
    const val = (v[f.id] ?? '').trim();
    if (f.id === 'license') return ['license', 'dcterms', licence(val)?.url ?? val];
    if (f.id === 'rightsHolder') return ['rightsHolder', 'dcterms', val];
    return [f.id, 'dwc', val];
  });
}

export function toXml(schema: SchemaId, v: Values): string {
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n';
  if (schema === 'dc') {
    return head + '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\n'
      + dcRecord(v).flatMap(([k, vals]) => vals.map((x) => el(`dc:${k}`, x))).join('\n') + '\n</oai_dc:dc>\n';
  }
  if (schema === 'dwc') {
    return head + '<dwr:SimpleDarwinRecordSet xmlns:dwr="http://rs.tdwg.org/dwc/xsd/simpledarwincore/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dwc="http://rs.tdwg.org/dwc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://rs.tdwg.org/dwc/xsd/simpledarwincore/ http://rs.tdwg.org/dwc/xsd/tdwg_dwc_simple.xsd">\n  <dwr:SimpleDarwinRecord>\n'
      + dwcRecord(v).map(([k, ns, x]) => el(`${ns}:${k}`, x, {}, '    ')).join('\n') + '\n  </dwr:SimpleDarwinRecord>\n</dwr:SimpleDarwinRecordSet>\n';
  }
  const j = dataciteJson(v) as Record<string, any>;
  const o: string[] = [];
  const I = '    ';
  const who = (tag: 'creator' | 'contributor', p: any) => {
    const r = [el(`${tag}Name`, p.name, { nameType: p.nameType }, I + '  ')];
    if (p.givenName) r.push(el('givenName', p.givenName, {}, I + '  '));
    if (p.familyName) r.push(el('familyName', p.familyName, {}, I + '  '));
    for (const n of p.nameIdentifiers ?? []) r.push(el('nameIdentifier', n.nameIdentifier, { nameIdentifierScheme: n.nameIdentifierScheme, schemeURI: n.schemeUri }, I + '  '));
    for (const a of p.affiliation ?? []) r.push(el('affiliation', a.name, {}, I + '  '));
    return `${I}<${tag}${tag === 'contributor' ? ` contributorType="${esc(p.contributorType)}"` : ''}>\n${r.join('\n')}\n${I}</${tag}>`;
  };
  const wrap = (tag: string, inner: string[]) => { if (inner.length) o.push(`  <${tag}>\n${inner.join('\n')}\n  </${tag}>`); };
  if (j.doi) o.push(el('identifier', j.doi, { identifierType: 'DOI' }));
  wrap('creators', j.creators.map((p: any) => who('creator', p)));
  wrap('titles', j.titles.map((x: any) => el('title', x.title, { titleType: x.titleType }, I)));
  o.push(el('publisher', j.publisher.name));
  o.push(el('publicationYear', j.publicationYear));
  o.push(el('resourceType', j.types.resourceType ?? '', { resourceTypeGeneral: j.types.resourceTypeGeneral }));
  wrap('subjects', (j.subjects ?? []).map((x: any) => el('subject', x.subject, {}, I)));
  wrap('contributors', (j.contributors ?? []).map((p: any) => who('contributor', p)));
  wrap('dates', (j.dates ?? []).map((x: any) => el('date', x.date, { dateType: x.dateType }, I)));
  if (j.language) o.push(el('language', j.language));
  wrap('relatedIdentifiers', (j.relatedIdentifiers ?? []).map((x: any) => el('relatedIdentifier', x.relatedIdentifier, { relatedIdentifierType: x.relatedIdentifierType, relationType: x.relationType }, I)));
  wrap('sizes', (j.sizes ?? []).map((x: string) => el('size', x, {}, I)));
  wrap('formats', (j.formats ?? []).map((x: string) => el('format', x, {}, I)));
  if (j.version) o.push(el('version', j.version));
  wrap('rightsList', (j.rightsList ?? []).map((x: any) => el('rights', x.rights, { rightsURI: x.rightsUri, rightsIdentifier: x.rightsIdentifier, rightsIdentifierScheme: x.rightsIdentifierScheme, schemeURI: x.schemeUri }, I)));
  wrap('descriptions', (j.descriptions ?? []).map((x: any) => el('description', x.description, { descriptionType: x.descriptionType }, I)));
  wrap('geoLocations', (j.geoLocations ?? []).map((g: any) => `${I}<geoLocation>\n${[g.geoLocationPlace ? el('geoLocationPlace', g.geoLocationPlace, {}, I + '  ') : '', g.geoLocationPoint ? `${I}  <geoLocationPoint>\n${el('pointLongitude', String(g.geoLocationPoint.pointLongitude), {}, I + '    ')}\n${el('pointLatitude', String(g.geoLocationPoint.pointLatitude), {}, I + '    ')}\n${I}  </geoLocationPoint>` : ''].filter(Boolean).join('\n')}\n${I}</geoLocation>`));
  wrap('fundingReferences', (j.fundingReferences ?? []).map((f: any) => `${I}<fundingReference>\n${[el('funderName', f.funderName, {}, I + '  '), f.awardNumber ? el('awardNumber', f.awardNumber, {}, I + '  ') : '', f.awardTitle ? el('awardTitle', f.awardTitle, {}, I + '  ') : ''].filter(Boolean).join('\n')}\n${I}</fundingReference>`));
  return head + '<resource xmlns="http://datacite.org/schema/kernel-4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.5/metadata.xsd">\n' + o.join('\n') + '\n</resource>\n';
}

export function toJson(schema: SchemaId, v: Values): unknown {
  if (schema === 'dc') return Object.fromEntries(dcRecord(v).map(([k, vals]) => [`dc:${k}`, vals.length === 1 && !['creator', 'contributor', 'subject', 'relation', 'format'].includes(k) ? vals[0] : vals]));
  if (schema === 'dwc') return Object.fromEntries(dwcRecord(v).map(([k, ns, x]) => [ns === 'dwc' ? k : `${ns}:${k}`, k === 'individualCount' || /^decimal|Meters$/.test(k) ? Number(x) : x]));
  return dataciteJson(v);
}

const csvCell = (c: string) => (/[",\r\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c);
/** CSV: Dublin Core and DataCite as term,value rows; Darwin Core as an occurrence-core table (terms across, one row). */
export function toCsv(schema: SchemaId, v: Values): string {
  let rows: string[][];
  if (schema === 'dwc') { const r = dwcRecord(v); rows = [r.map(([k]) => k), r.map(([, , x]) => x)]; }
  else if (schema === 'dc') rows = [['term', 'value'], ...dcRecord(v).flatMap(([k, vals]) => vals.map((x) => [`dc:${k}`, x]))];
  else {
    const flat: string[][] = [];
    const walk = (o: unknown, p: string) => {
      if (Array.isArray(o)) o.forEach((x, i) => walk(x, `${p}[${i}]`));
      else if (o && typeof o === 'object') for (const [k, x] of Object.entries(o)) walk(x, p ? `${p}.${k}` : k);
      else flat.push([p, String(o)]);
    };
    walk(dataciteJson(v), '');
    rows = [['property', 'value'], ...flat];
  }
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

/** Made-up example values for each form (ORCID's own test record and Crossref's test DOI prefix 10.5555). */
export const EXAMPLES: Record<SchemaId, Values> = {
  dc: {
    title: 'Stream temperature at three sites, spring 2026 (example)', creator: 'Rivera, Ana\nOkafor, Chidi', subject: 'stream temperature, water quality, field survey',
    description: 'Made-up example data: hourly water temperature from three loggers in a small stream.', publisher: 'Example River Institute', date: '2026-03-01/2026-05-31', type: 'Dataset',
    format: 'text/csv', identifier: 'https://doi.org/10.5555/example.2026', language: 'en', coverage: 'Example Creek', rights: 'CC-BY-4.0',
  },
  datacite: {
    doi: '10.5555/example.2026', creators: 'Rivera, Ana; 0000-0002-1825-0097; Example River Institute\nExample River Institute', title: 'Stream temperature at three sites, spring 2026 (example)',
    publisher: 'Example Data Repository', publicationYear: '2026', resourceTypeGeneral: 'Dataset', resourceType: 'Field survey', subjects: 'stream temperature, water quality',
    contributors: 'ContactPerson: Okafor, Chidi; ; Example River Institute', dates: 'Collected: 2026-03-01/2026-05-31', relatedIdentifiers: 'IsSupplementTo DOI 10.5555/12345678',
    abstract: 'Made-up example data: hourly water temperature from three loggers in a small stream.', methods: 'Loggers recorded every hour; values were checked against a hand thermometer each week.',
    geoPlace: 'Example Creek', geoLat: '45.42', geoLon: '-75.69', language: 'en', version: '1.0', rights: 'CC-BY-4.0', formats: 'text/csv', sizes: '3 files',
  },
  dwc: {
    occurrenceID: 'urn:example:occ:0001', basisOfRecord: 'HumanObservation', scientificName: 'Turdus migratorius Linnaeus, 1766', kingdom: 'Animalia', taxonRank: 'species',
    eventDate: '2026-05-14', recordedBy: 'Ana Rivera', individualCount: '2', occurrenceStatus: 'present', decimalLatitude: '45.4215', decimalLongitude: '-75.6972',
    geodeticDatum: 'WGS84', coordinateUncertaintyInMeters: '30', countryCode: 'CA', locality: 'Example Park, near the footbridge', license: 'CC-BY-4.0',
  },
};
