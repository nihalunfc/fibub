// Figures and simulations for the Offline AI lessons, by the name used in the text as <!--fig:name-->.
import CourseMap from './CourseMap.astro';
import TwoHomes from './TwoHomes.astro';
import WhatTravels from './WhatTravels.astro';
import PickTrack from './PickTrack.astro';
import WillItFit from './WillItFit.astro';
import ToyTokenizer from './ToyTokenizer.astro';
import NextWord from './NextWord.astro';
import Experts from './Experts.astro';
import ContextBucket from './ContextBucket.astro';
import TokenBudget from './TokenBudget.astro';
import SpeedLimit from './SpeedLimit.astro';
import BuildRig from './BuildRig.astro';
import PowerBill from './PowerBill.astro';
import KvCache from './KvCache.astro';
import EmbeddingMap from './EmbeddingMap.astro';
import ChunkSize from './ChunkSize.astro';
import AgentLoop from './AgentLoop.astro';
import AgentSandbox from './AgentSandbox.astro';
import LoraSize from './LoraSize.astro';
import QueueCounter from './QueueCounter.astro';
import PlanPrices from './PlanPrices.astro';
import BreakEven from './BreakEven.astro';
import ApiBill from './ApiBill.astro';

export const FIGURES: Record<string, any> = {
  'course-map': CourseMap,
  'two-homes': TwoHomes,
  'what-travels': WhatTravels,
  'pick-track': PickTrack,
  'will-it-fit': WillItFit,
  'toy-tokenizer': ToyTokenizer,
  'next-word': NextWord,
  'experts': Experts,
  'context-bucket': ContextBucket,
  'token-budget': TokenBudget,
  'speed-limit': SpeedLimit,
  'build-rig': BuildRig,
  'power-bill': PowerBill,
  'kv-cache': KvCache,
  'embedding-map': EmbeddingMap,
  'chunk-size': ChunkSize,
  'agent-loop': AgentLoop,
  'agent-sandbox': AgentSandbox,
  'lora-size': LoraSize,
  'queue-counter': QueueCounter,
  'plan-prices': PlanPrices,
  'break-even': BreakEven,
  'api-bill': ApiBill,
};
