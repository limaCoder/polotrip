const IGNORE_INSTRUCTIONS_PATTERN =
  /ignore\s+(previous|prior|all|above)\s+instructions?/i;
const FORGET_PATTERN = /forget\s+(everything|all|previous|prior)/i;
const YOU_ARE_NOW_PATTERN = /you\s+are\s+now\s+/i;
const NEW_INSTRUCTIONS_PATTERN = /new\s+instructions?:/i;
const SYSTEM_PATTERN = /system\s*:\s*/i;
const SYSTEM_BRACKETS_PATTERN = /\[system\]/i;
const PRETEND_PATTERN = /pretend\s+(to\s+be|you\s+are)/i;
const ROLEPLAY_PATTERN = /roleplay\s+as/i;
const ACT_AS_PATTERN = /act\s+as\s+(a\s+)?(?!travel|photo|album)/i;
const NEW_ROLE_PATTERN = /your\s+new\s+role/i;
const DISREGARD_PATTERN = /disregard\s+/i;
const OVERRIDE_PATTERN = /override\s+/i;
const IM_START_PATTERN = /<\|im_start\|>/i;
const IM_END_PATTERN = /<\|im_end\|>/i;
const INST_START_PATTERN = /\[INST\]/i;
const INST_END_PATTERN = /\[\/INST\]/i;

const SUSPICIOUS_PATTERNS = [
  IGNORE_INSTRUCTIONS_PATTERN,
  FORGET_PATTERN,
  YOU_ARE_NOW_PATTERN,
  NEW_INSTRUCTIONS_PATTERN,
  SYSTEM_PATTERN,
  SYSTEM_BRACKETS_PATTERN,
  PRETEND_PATTERN,
  ROLEPLAY_PATTERN,
  ACT_AS_PATTERN,
  NEW_ROLE_PATTERN,
  DISREGARD_PATTERN,
  OVERRIDE_PATTERN,
  IM_START_PATTERN,
  IM_END_PATTERN,
  INST_START_PATTERN,
  INST_END_PATTERN,
];

export function detectPromptInjection(message: string): boolean {
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(message));
}
