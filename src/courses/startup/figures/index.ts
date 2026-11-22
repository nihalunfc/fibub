// Figures and interactives for the Start a startup lessons, by the name used in the text as <!--fig:name-->.
// Every lesson starts with <!--fig:country-->, which also loads ./su.ts (country switch, step players,
// checklists, text animations). Shared look: ./startup.css. Money helpers: ./fmt.ts.
import CountrySwitch from './CountrySwitch.astro';
import StartupOrSmall from './StartupOrSmall.astro';
import OnlineOffline from './OnlineOffline.astro';
import TeamGaps from './TeamGaps.astro';
import AzMap from './AzMap.astro';
import SourceCheck from './SourceCheck.astro';
import ProblemScore from './ProblemScore.astro';
import InterviewSort from './InterviewSort.astro';
import MvpPicker from './MvpPicker.astro';
import UnitEcon from './UnitEcon.astro';
import RunwaySim from './RunwaySim.astro';
import LeanCanvas from './LeanCanvas.astro';
import LiabilityShield from './LiabilityShield.astro';
import PartnerSplit from './PartnerSplit.astro';
import CompanyRoles from './CompanyRoles.astro';
import UsEntityTax from './UsEntityTax.astro';
import StructureChooser from './StructureChooser.astro';
import WhereRegister from './WhereRegister.astro';
// Module 4
import NameCheck from './NameCheck.astro';
import SpicePlus from './SpicePlus.astro';
import MsmeCheck from './MsmeCheck.astro';
import BnAccounts from './BnAccounts.astro';
import StateFees from './StateFees.astro';
import ForeignQualify from './ForeignQualify.astro';
import RecordsKeep from './RecordsKeep.astro';

// Modules 5-6
import LicenceFinder from './LicenceFinder.astro';
import FoodLicence from './FoodLicence.astro';
import HomeRisk from './HomeRisk.astro';
import SiteCheck from './SiteCheck.astro';
import LandedCost from './LandedCost.astro';
import AccountDocs from './AccountDocs.astro';
import PaymentFees from './PaymentFees.astro';
import LedgerSim from './LedgerSim.astro';
import FundingMatch from './FundingMatch.astro';
import SafeConvert from './SafeConvert.astro';
import CapTable from './CapTable.astro';
import GstChain from './GstChain.astro';
import GstRegCheck from './GstRegCheck.astro';
import SmallSupplier from './SmallSupplier.astro';
import NexusCheck from './NexusCheck.astro';
import BorderTax from './BorderTax.astro';
import InvoiceCheck from './InvoiceCheck.astro';
import ProfitFlow from './ProfitFlow.astro';
import IndiaBizTax from './IndiaBizTax.astro';
import CanadaBizTax from './CanadaBizTax.astro';
import UsBizTax from './UsBizTax.astro';
import PayYourself from './PayYourself.astro';
import ExpenseSort from './ExpenseSort.astro';
import TaxCalendar from './TaxCalendar.astro';
import WorkerTest from './WorkerTest.astro';
import Payslip from './Payslip.astro';
import HireCost from './HireCost.astro';
import AgreementBuilder from './AgreementBuilder.astro';
import EquitySplit from './EquitySplit.astro';
import VestingTimeline from './VestingTimeline.astro';
import EsopTax from './EsopTax.astro';
import LeaverCalc from './LeaverCalc.astro';
import IpPicker from './IpPicker.astro';
import TrademarkFees from './TrademarkFees.astro';
import ContractClauses from './ContractClauses.astro';
import EmailRules from './EmailRules.astro';
import LegalPages from './LegalPages.astro';
import FilingFinder from './FilingFinder.astro';
import ComplianceCal from './ComplianceCal.astro';
import InsurancePicker from './InsurancePicker.astro';
import ExpandPath from './ExpandPath.astro';
import CloseSteps from './CloseSteps.astro';
import LaunchPlan from './LaunchPlan.astro';

export const FIGURES: Record<string, any> = {
  country: CountrySwitch,
  'startup-or-small': StartupOrSmall,
  'online-offline': OnlineOffline,
  'team-gaps': TeamGaps,
  'az-map': AzMap,
  'source-check': SourceCheck,
  'problem-score': ProblemScore,
  'interview-sort': InterviewSort,
  'mvp-picker': MvpPicker,
  'unit-econ': UnitEcon,
  'runway-sim': RunwaySim,
  'lean-canvas': LeanCanvas,
  'liability-shield': LiabilityShield,
  'partner-split': PartnerSplit,
  'company-roles': CompanyRoles,
  'us-entity-tax': UsEntityTax,
  'structure-chooser': StructureChooser,
  'where-register': WhereRegister,
  'name-check': NameCheck,
  'spice-plus': SpicePlus,
  'msme-check': MsmeCheck,
  'bn-accounts': BnAccounts,
  'state-fees': StateFees,
  'foreign-qualify': ForeignQualify,
  'records-keep': RecordsKeep,
  'licence-finder': LicenceFinder,
  'food-licence': FoodLicence,
  'home-risk': HomeRisk,
  'site-check': SiteCheck,
  'landed-cost': LandedCost,
  'account-docs': AccountDocs,
  'payment-fees': PaymentFees,
  'ledger-sim': LedgerSim,
  'funding-match': FundingMatch,
  'safe-convert': SafeConvert,
  'cap-table': CapTable,
  // Module 7
  'gst-chain': GstChain,
  'gst-reg-check': GstRegCheck,
  'small-supplier': SmallSupplier,
  'nexus-check': NexusCheck,
  'border-tax': BorderTax,
  'invoice-check': InvoiceCheck,
  // Module 8
  'profit-flow': ProfitFlow,
  'india-biz-tax': IndiaBizTax,
  'canada-biz-tax': CanadaBizTax,
  'us-biz-tax': UsBizTax,
  'pay-yourself': PayYourself,
  'expense-sort': ExpenseSort,
  'tax-calendar': TaxCalendar,
  // Module 9
  'worker-test': WorkerTest,
  'payslip': Payslip,
  'hire-cost': HireCost,
  // Module 10
  'agreement-builder': AgreementBuilder,
  'equity-split': EquitySplit,
  'vesting-timeline': VestingTimeline,
  'esop-tax': EsopTax,
  'leaver-calc': LeaverCalc,
  // Module 11
  'ip-picker': IpPicker,
  'trademark-fees': TrademarkFees,
  'contract-clauses': ContractClauses,
  'email-rules': EmailRules,
  'legal-pages': LegalPages,
  // Module 12
  'filing-finder': FilingFinder,
  'compliance-cal': ComplianceCal,
  'insurance-picker': InsurancePicker,
  'expand-path': ExpandPath,
  'close-steps': CloseSteps,
  'launch-plan': LaunchPlan,
};
