import React, { useEffect, useMemo, useState } from 'react';

const FT_PER_M = 3.28084;

const CABLE_OPTIONS = [
  { value: 'lmr400', label: 'LMR-400', impedance: 50, vf: 0.85, lossAt1GHz: 0.22 },
  { value: 'lmr240', label: 'LMR-240', impedance: 50, vf: 0.84, lossAt1GHz: 0.37 },
  { value: 'rg58', label: 'RG-58', impedance: 50, vf: 0.66, lossAt1GHz: 0.68 },
  { value: 'rg213', label: 'RG-213', impedance: 50, vf: 0.66, lossAt1GHz: 0.39 },
  { value: 'heliax12', label: '1/2" Heliax', impedance: 50, vf: 0.88, lossAt1GHz: 0.15 },
];

const CONNECTOR_OPTIONS = [
  { value: 'n_type', label: 'N-Type', insertionLoss: 0.05, mismatch: 0.011 },
  { value: 'sma', label: 'SMA', insertionLoss: 0.08, mismatch: 0.018 },
  { value: 'din716', label: '7/16 DIN', insertionLoss: 0.04, mismatch: 0.009 },
  { value: 'tnc', label: 'TNC', insertionLoss: 0.07, mismatch: 0.017 },
];

const CONDITION_FACTORS = {
  Excellent: 0.88,
  Good: 1.0,
  Used: 1.16,
  Poor: 1.36,
};

const TORQUE_FACTORS = {
  Proper: 1.0,
  Under: 1.24,
  Over: 1.08,
};

const ANTENNA_OPTIONS = [
  { value: 'omni_698', label: 'Omni 698-2700', type: 'Omni', minMHz: 698, maxMHz: 2700, baseVswr: 1.25 },
  { value: 'panel_1710', label: 'Panel 1710-2170', type: 'Panel', minMHz: 1710, maxMHz: 2170, baseVswr: 1.19 },
  { value: 'sector_3300', label: 'Sector 3300-4200', type: 'Sector', minMHz: 3300, maxMHz: 4200, baseVswr: 1.32 },
  { value: 'yagi_700', label: 'Yagi 700-960', type: 'Directional', minMHz: 700, maxMHz: 960, baseVswr: 1.42 },
  { value: 'dish_24g', label: 'Dish 2400-6000', type: 'Directional', minMHz: 2400, maxMHz: 6000, baseVswr: 1.36 },
];

const MATCH_QUALITY_FACTORS = {
  Excellent: 0.86,
  Good: 1.0,
  Fair: 1.2,
  Marginal: 1.42,
};

const ENVIRONMENT_FACTORS = {
  Indoor: 0.95,
  'Outdoor - Clear': 1.0,
  'Outdoor - Wet': 1.14,
  'Outdoor - Corrosive': 1.28,
};

const SCENARIOS = {
  good: {
    label: 'Good System',
    cableLossBoost: 0.0,
    connectorLossBoost: 0.0,
    mismatchBoost: 0.0,
    faultGamma: 0.0,
    faultPosition: null,
    color: '#55d17d',
  },
  loose: {
    label: 'Loose Connector',
    cableLossBoost: 0.02,
    connectorLossBoost: 0.32,
    mismatchBoost: 0.12,
    faultGamma: 0.18,
    faultPosition: 0.14,
    color: '#f5b14d',
  },
  water: {
    label: 'Water Ingress',
    cableLossBoost: 0.52,
    connectorLossBoost: 0.1,
    mismatchBoost: 0.17,
    faultGamma: 0.2,
    faultPosition: 0.46,
    color: '#4ab3ff',
  },
  crushed: {
    label: 'Crushed Cable',
    cableLossBoost: 0.44,
    connectorLossBoost: 0.0,
    mismatchBoost: 0.22,
    faultGamma: 0.28,
    faultPosition: 0.59,
    color: '#e0805d',
  },
  adapter: {
    label: 'Bad Adapter',
    cableLossBoost: 0.08,
    connectorLossBoost: 0.48,
    mismatchBoost: 0.26,
    faultGamma: 0.24,
    faultPosition: 0.08,
    color: '#d98cff',
  },
  wrong: {
    label: 'Wrong Antenna',
    cableLossBoost: 0.0,
    connectorLossBoost: 0.06,
    mismatchBoost: 0.36,
    faultGamma: 0.16,
    faultPosition: 0.97,
    color: '#ff6f91',
  },
  open: {
    label: 'Open Circuit',
    cableLossBoost: 0.04,
    connectorLossBoost: 0.2,
    mismatchBoost: 0.45,
    faultGamma: 0.5,
    faultPosition: 0.84,
    color: '#ff5c5c',
  },
  short: {
    label: 'Short Circuit',
    cableLossBoost: 0.06,
    connectorLossBoost: 0.16,
    mismatchBoost: 0.5,
    faultGamma: 0.54,
    faultPosition: 0.78,
    color: '#ff8c40',
  },
};

const TABS = [
  { id: 'returnLoss', label: 'Return Loss' },
  { id: 'vswr', label: 'VSWR' },
  { id: 'cableLoss', label: 'Cable Loss' },
  { id: 'dtf', label: 'DTF (Return Loss)' },
  { id: 's11Phase', label: 'S11 Phase' },
];

const WORKSPACE_TABS = [
  { id: 'build', label: 'Build' },
  { id: 'measure', label: 'Measure' },
  { id: 'diagnose', label: 'Diagnose' },
  { id: 'learn', label: 'Learn' },
];

const VARIABLE_GUIDE = [
  {
    variable: 'Cable Type',
    meaning: 'Defines baseline attenuation, velocity factor, and expected flexibility.',
    defaultValue: 'LMR-400',
    note: 'If unknown, start with LMR-400 for macro-style runs.',
  },
  {
    variable: 'Cable Length',
    meaning: 'Physical run length from analyzer to antenna feed point.',
    defaultValue: '100 ft',
    note: 'Estimate route length, then add 5-10% service slack.',
  },
  {
    variable: 'Impedance',
    meaning: 'Nominal line impedance for cable, connectors, and antenna system.',
    defaultValue: '50 ohm',
    note: 'Most RF comms systems use 50 ohm.',
  },
  {
    variable: 'Velocity Factor',
    meaning: 'Signal speed in cable as a fraction of light speed.',
    defaultValue: '0.85',
    note: 'Use 0.85 for LMR-400, 0.66 for RG-58/RG-213.',
  },
  {
    variable: 'Cable Condition',
    meaning: 'Represents wear, bends, age, and jacket health impact.',
    defaultValue: 'Good',
    note: 'Use Good unless the run has known wear or weathering.',
  },
  {
    variable: 'Connector Type/Gender',
    meaning: 'Physical interface and mating geometry at each end.',
    defaultValue: 'N-Type / Male',
    note: 'N-Type is a robust outdoor default for many installs.',
  },
  {
    variable: 'Connector Condition/Torque',
    meaning: 'Mating quality and mechanical tightness affecting mismatch.',
    defaultValue: 'Good / Proper',
    note: 'Use Proper torque unless the joint is suspect.',
  },
  {
    variable: 'Adapters',
    meaning: 'Additional transitions in path that add loss and mismatch.',
    defaultValue: '0',
    note: 'Keep at zero unless adapters are definitely in-line.',
  },
  {
    variable: 'Antenna Type/Model',
    meaning: 'Selects operating band and expected baseline match profile.',
    defaultValue: 'Omni 698-2700',
    note: 'Use a model that fully covers your sweep frequencies.',
  },
  {
    variable: 'Match Quality',
    meaning: 'Expected antenna impedance match quality.',
    defaultValue: 'Good',
    note: 'Use Good unless you know antenna tuning is degraded.',
  },
  {
    variable: 'Environment',
    meaning: 'Weather/corrosion environment influence on RF interfaces.',
    defaultValue: 'Outdoor - Clear',
    note: 'Use Outdoor - Wet or Corrosive for harsher sites.',
  },
  {
    variable: 'Start/Stop Frequency',
    meaning: 'Sweep span used for return loss, VSWR, and phase traces.',
    defaultValue: '600 to 3000 MHz',
    note: 'Set span to your intended operating band first.',
  },
  {
    variable: 'Points',
    meaning: 'Number of sweep samples; more points = higher detail.',
    defaultValue: '161',
    note: 'Good balance of speed and detail.',
  },
  {
    variable: 'Calibration',
    meaning: 'Reference method for correcting systematic analyzer error.',
    defaultValue: '1-Port (Open/Short/Load)',
    note: 'Best default for dependable single-port measurements.',
  },
  {
    variable: 'DTF Range',
    meaning: 'Maximum cable distance scanned for discontinuities.',
    defaultValue: '150 ft',
    note: 'Set slightly above total cable run length.',
  },
  {
    variable: 'DTF Resolution',
    meaning: 'Spatial detail for locating faults along the line.',
    defaultValue: 'High (1 ft)',
    note: 'Use Very High for short runs, Medium for faster scans.',
  },
  {
    variable: 'Scenario + Severity',
    meaning: 'Injected impairment model for training and diagnostics.',
    defaultValue: 'Good System at 30%',
    note: 'Start with Good System, then apply one impairment at a time.',
  },
  {
    variable: 'Sweep Type',
    meaning: 'Selects how frequency points are distributed across the span.',
    defaultValue: 'Linear',
    note: 'Use Linear for general checks; use Log when wide-span behavior is the priority.',
  },
  {
    variable: 'Sweep Averaging',
    meaning: 'Number of sweep passes averaged per displayed point.',
    defaultValue: '2',
    note: 'Increase averaging to stabilize noisy traces at the cost of sweep speed.',
  },
  {
    variable: 'Display Format',
    meaning: 'Controls the measurement presentation emphasis for the active trace.',
    defaultValue: 'Log Mag',
    note: 'Use Log Mag for return loss detail, VSWR for matching behavior, Linear Mag for relative magnitude.',
  },
  {
    variable: 'Calibration Status',
    meaning: 'Indicates whether the virtual analyzer is currently calibrated.',
    defaultValue: 'Calibrated',
    note: 'Recalibrate whenever setup assumptions change so results remain comparable.',
  },
  {
    variable: 'Sweep Progress',
    meaning: 'Percent completion of the current simulated measurement sweep.',
    defaultValue: '100%',
    note: 'Wait for completion before comparing traces or exporting data.',
  },
  {
    variable: 'System Health Score',
    meaning: 'Composite diagnostic score derived from return loss, VSWR, cable loss, and DTF behavior.',
    defaultValue: '90+ in good baseline',
    note: 'Track score changes after each scenario adjustment to isolate impact.',
  },
  {
    variable: 'Fault Location Estimate',
    meaning: 'Distance-domain inference of the most likely discontinuity location on the cable path.',
    defaultValue: 'Not localized',
    note: 'Use this as a field starting point, then validate with physical inspection.',
  },
  {
    variable: 'Open Issues',
    meaning: 'Count of currently detected diagnostic issues from the active measurement state.',
    defaultValue: '0 in healthy baseline',
    note: 'Prioritize issue count reduction while protecting key pass/fail thresholds.',
  },
  {
    variable: 'Critical / High Issues',
    meaning: 'Subset of open issues with highest operational risk and urgency.',
    defaultValue: '0',
    note: 'Treat these first because they most strongly affect availability and performance.',
  },
  {
    variable: 'DTF Peak',
    meaning: 'Strongest reflected signature observed in distance-to-fault response.',
    defaultValue: 'Low amplitude in clean systems',
    note: 'Higher peaks usually indicate stronger discontinuities needing inspection.',
  },
  {
    variable: 'Return Loss (Min)',
    meaning: 'Lowest return loss value observed across the current sweep span.',
    defaultValue: '>= 14 dB target',
    note: 'Lower minima indicate stronger reflections and possible mismatch/fault conditions.',
  },
  {
    variable: 'VSWR (Max)',
    meaning: 'Highest standing-wave ratio observed in the active measurement window.',
    defaultValue: '<= 2.0 target',
    note: 'Higher peaks usually track impedance mismatch and reflected-power growth.',
  },
];

const WORKFLOW_GUIDE = [
  'Build tab: apply recommended defaults, then set cable, connectors, antenna, and analyzer span for your system.',
  'Measure tab: run sweep sessions, place markers, and compare traces while changing sweep format and averaging.',
  'Diagnose tab: review health score, issue severity, and fault location estimates generated from current measurements.',
  'Learn tab: use interactive sliders and quizzes to connect mismatch/loss/reflections with trace behavior.',
  'Use one scenario at a time, then increase severity to see cause-and-effect across all four tabs.',
];

const TAB_HELP_GUIDE = [
  {
    tab: 'Build',
    purpose: 'Configure the RF path and establish a baseline model before running measurements.',
    actions: [
      'Set cable type/length, connector condition, antenna model, and analyzer sweep span.',
      'Use Scenario + Severity to inject a controlled fault profile for training.',
      'Confirm baseline status is PASS in Good System before introducing degradations.',
    ],
    outputs: 'System overview cards, pass/check status, and baseline traces used by the other tabs.',
  },
  {
    tab: 'Measure',
    purpose: 'Operate the virtual analyzer like a bench workflow and capture measurement evidence.',
    actions: [
      'Choose sweep type, averaging, and display format.',
      'Run continuous or single sweeps and place M1/M2/M3 markers on the live chart.',
      'Export trace snapshots as CSV or JSON for review and reporting.',
    ],
    outputs: 'Live trace view, marker table, session summary metrics, and downloadable data.',
  },
  {
    tab: 'Diagnose',
    purpose: 'Convert measured behavior into likely root causes and ranked action steps.',
    actions: [
      'Review health score and metric deltas versus baseline.',
      'Open each detected issue for severity, explanation, validation checks, and recommendations.',
      'Use DTF hotspots and estimated distance-to-fault to focus field inspection.',
    ],
    outputs: 'Issue list, drill-down diagnostics, fault localization clues, and prioritized recommendations.',
  },
  {
    tab: 'Learn',
    purpose: 'Train intuition by tying RF theory directly to simulated behavior changes.',
    actions: [
      'Adjust mismatch, cable stress, and reflection controls to see trace changes in real time.',
      'Use the baseline-vs-lab comparison charts to connect theory with measured impact.',
      'Complete quizzes and notes to reinforce troubleshooting patterns.',
    ],
    outputs: 'Topic walkthroughs, dynamic comparison views, quiz feedback, and reusable study notes.',
  },
];

const PASS_RULES = [
  'VSWR (Max) <= 2.0',
  'Return Loss (Min) >= 14 dB',
  'Cable Loss @ 1 GHz <= 1.2 dB',
  'Reflected Power (Max) <= 10%',
];

const LEARN_TOPIC_CATALOG = [
  {
    id: 'mismatch',
    title: 'Impedance Mismatch',
    theory:
      'When source, line, and load impedances are not aligned, part of the wave reflects back to the analyzer. That increases VSWR and pushes return loss lower.',
    practice:
      'Increase mismatch control to see VSWR rise and return loss minima collapse. This models poor connector mating, wrong antenna, or degraded feedpoint match.',
    example:
      'Field example: damaged jumper at the antenna feed creates strong mismatch around operating band center.',
  },
  {
    id: 'cableLoss',
    title: 'Cable Loss',
    theory:
      'Cable attenuation grows with frequency, run length, and condition. Excess loss reduces delivered RF power and can mask weak reflections.',
    practice:
      'Increase cable stress to raise cable loss at 1 GHz and observe lower margin in pass/fail thresholds.',
    example:
      'Field example: long outdoor run with water ingress causes elevated insertion loss and reduced link budget.',
  },
  {
    id: 'reflections',
    title: 'Reflections and DTF',
    theory:
      'Discontinuities along the line create reflections that can be localized in distance domain (DTF). Larger peaks indicate stronger faults.',
    practice:
      'Change reflection type/severity and watch DTF hotspot location plus reflected power response.',
    example:
      'Field example: loose connector near tower top shows DTF peak close to expected jumper distance.',
  },
];

const LEARN_QUIZ_ITEMS = [
  {
    id: 'quiz1',
    prompt: 'What usually happens to VSWR when impedance mismatch increases?',
    options: ['It decreases toward 1:1', 'It increases above baseline', 'It stays fixed regardless of mismatch'],
    correctIndex: 1,
    explanation: 'Higher mismatch increases reflection coefficient, which increases VSWR.',
  },
  {
    id: 'quiz2',
    prompt: 'A stronger DTF peak at a fixed distance most likely indicates:',
    options: ['A cleaner transmission line', 'A stronger discontinuity at that location', 'Lower cable attenuation only'],
    correctIndex: 1,
    explanation: 'DTF peaks represent discontinuities; stronger peaks suggest stronger impedance discontinuities.',
  },
  {
    id: 'quiz3',
    prompt: 'If cable loss rises significantly, the best first action is to:',
    options: ['Increase TX power immediately', 'Validate cable condition/length and retest', 'Ignore unless VSWR also fails'],
    correctIndex: 1,
    explanation: 'Loss issues should be traced to cable path and condition before power changes.',
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fract(value) {
  return value - Math.floor(value);
}

function noise(index, seed, magnitude) {
  const raw = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return (fract(raw) - 0.5) * magnitude;
}

function gaussian(x, center, width) {
  const norm = (x - center) / width;
  return Math.exp(-(norm * norm));
}

function toDb(value) {
  return `${value.toFixed(2)} dB`;
}

function toPct(value) {
  return `${value.toFixed(1)} %`;
}

function simulate(config, scenarioKey, severity, seed) {
  const scenario = SCENARIOS[scenarioKey];
  const cable = CABLE_OPTIONS.find((item) => item.value === config.cableType) || CABLE_OPTIONS[0];
  const nearConnector = CONNECTOR_OPTIONS.find((item) => item.value === config.nearConnectorType) || CONNECTOR_OPTIONS[0];
  const farConnector = CONNECTOR_OPTIONS.find((item) => item.value === config.farConnectorType) || CONNECTOR_OPTIONS[0];
  const antenna = ANTENNA_OPTIONS.find((item) => item.value === config.antennaModel) || ANTENNA_OPTIONS[0];

  const startMHz = Math.min(config.startMHz, config.stopMHz - 1);
  const stopMHz = Math.max(config.stopMHz, config.startMHz + 1);
  const points = Math.round(clamp(config.points, 81, 401));
  const severityNorm = clamp(severity / 100, 0, 1);

  const nearConditionFactor = CONDITION_FACTORS[config.nearCondition] || 1;
  const farConditionFactor = CONDITION_FACTORS[config.farCondition] || 1;
  const cableConditionFactor = CONDITION_FACTORS[config.cableCondition] || 1;
  const nearTorqueFactor = TORQUE_FACTORS[config.nearTorque] || 1;
  const farTorqueFactor = TORQUE_FACTORS[config.farTorque] || 1;
  const matchQualityFactor = MATCH_QUALITY_FACTORS[config.matchQuality] || 1;
  const environmentFactor = ENVIRONMENT_FACTORS[config.environment] || 1;

  const lengthFt = config.lengthFt;
  const totalConnectorLoss =
    (nearConnector.insertionLoss * nearConditionFactor * nearTorqueFactor) +
    (farConnector.insertionLoss * farConditionFactor * farTorqueFactor) +
    ((config.nearAdapters + config.farAdapters) * 0.08);

  const connectorMismatch =
    ((nearConnector.mismatch * nearConditionFactor) + (farConnector.mismatch * farConditionFactor)) * 0.5 +
    ((config.nearAdapters + config.farAdapters) * 0.009);

  const scenarioConnectorLoss = totalConnectorLoss * (1 + (scenario.connectorLossBoost * severityNorm));
  // Keep "good" cases passing, but make fault scenarios meaningfully impact S11.
  const scenarioMismatchBase = connectorMismatch + (scenario.mismatchBoost * 0.42 * severityNorm);
  const baseGamma = (antenna.baseVswr - 1) / (antenna.baseVswr + 1);
  const span = stopMHz - startMHz;

  const freqs = [];
  const returnLossSeries = [];
  const vswrSeries = [];
  const cableLossSeries = [];
  const s11PhaseSeries = [];
  const gammaSeries = [];

  for (let i = 0; i < points; i += 1) {
    const ratio = i / (points - 1);
    const freqMHz = startMHz + (span * ratio);
    const freqGHz = Math.max(0.08, freqMHz / 1000);
    const inBand = freqMHz >= antenna.minMHz && freqMHz <= antenna.maxMHz;
    const offBandDistance = inBand
      ? 0
      : Math.abs(freqMHz - clamp(freqMHz, antenna.minMHz, antenna.maxMHz)) / Math.max(antenna.maxMHz - antenna.minMHz, 1);

    const freqRipple = (Math.sin((freqMHz - startMHz) * 0.02 + seed) * 0.008) + noise(i, seed, 0.006);
    const bandPenalty = inBand ? 0 : clamp(0.18 + (offBandDistance * 0.35), 0, 0.62);

    const cableLossBase = (lengthFt / 100) * config.lossAt1GHz * Math.sqrt(freqGHz);
    const cableLoss = cableLossBase * cableConditionFactor * (1 + (scenario.cableLossBoost * severityNorm));

    const totalGamma = clamp(
      (baseGamma * matchQualityFactor * environmentFactor) +
      scenarioMismatchBase +
      bandPenalty +
      (scenario.faultGamma * 0.78 * severityNorm) +
      freqRipple,
      0.02,
      0.94,
    );

    const vswr = (1 + totalGamma) / (1 - totalGamma);
    const idealReturnLoss = -20 * Math.log10(totalGamma);
    const measuredReturnLoss = clamp(
      idealReturnLoss - (scenarioConnectorLoss * 0.75) + (cableLoss * 0.2) - (severityNorm * 4.0 * scenario.mismatchBoost),
      1.8,
      48,
    );
    const phase = clamp(
      (Math.sin(ratio * Math.PI * 2.4 + seed * 0.33) * 145) +
      (Math.cos(ratio * Math.PI * 0.7) * 28) +
      (scenario.mismatchBoost * 120 * severityNorm) +
      noise(i, seed * 2.2, 15),
      -179,
      179,
    );

    freqs.push(freqMHz);
    returnLossSeries.push(measuredReturnLoss);
    vswrSeries.push(vswr);
    cableLossSeries.push(cableLoss + scenarioConnectorLoss);
    s11PhaseSeries.push(phase);
    gammaSeries.push(totalGamma);
  }

  const dtfRangeFt = config.dtfRangeFt;
  const dtfResolution = config.dtfResolutionFt;
  const dtfPoints = Math.round(clamp(dtfRangeFt / dtfResolution, 80, 320));
  const faultDistanceFt = scenario.faultPosition ? (lengthFt * scenario.faultPosition) : null;
  const antennaEndDistanceFt = lengthFt;
  const dtfSeries = [];

  for (let i = 0; i <= dtfPoints; i += 1) {
    const d = (dtfRangeFt / dtfPoints) * i;
    const floor = -36 + (Math.sin((d / Math.max(dtfRangeFt, 1)) * Math.PI * 6) * 1.1) + noise(i, seed * 1.7, 1.5);

    const antennaPeak = gaussian(d, antennaEndDistanceFt, Math.max(2, dtfResolution * 3)) * (14 + (severityNorm * scenario.mismatchBoost * 6));
    const faultPeak = faultDistanceFt
      ? gaussian(d, faultDistanceFt, Math.max(2, dtfResolution * 2)) * (scenario.faultGamma * severityNorm * 52)
      : 0;
    const dtfValue = clamp(floor + antennaPeak + faultPeak, -40, 0);
    dtfSeries.push(dtfValue);
  }

  const midIdx = freqs.reduce((bestIdx, currentFreq, index) => {
    const bestDiff = Math.abs(freqs[bestIdx] - 1000);
    const currentDiff = Math.abs(currentFreq - 1000);
    return currentDiff < bestDiff ? index : bestIdx;
  }, 0);

  const inBandIndices = freqs
    .map((freqMHz, index) => ((freqMHz >= antenna.minMHz && freqMHz <= antenna.maxMHz) ? index : -1))
    .filter((index) => index >= 0);
  const assessmentIndices = inBandIndices.length
    ? inBandIndices
    : freqs.map((_, index) => index);

  const vswrMax = Math.max(...assessmentIndices.map((index) => vswrSeries[index]));
  const returnLossMin = Math.min(...assessmentIndices.map((index) => returnLossSeries[index]));
  const cableLossAt1GHz = cableLossSeries[midIdx];
  const reflectedPowerMax = Math.max(...assessmentIndices.map((index) => gammaSeries[index] * gammaSeries[index] * 100));
  const dtfPeak = Math.max(...dtfSeries);
  const singlePortLoss = returnLossMin;

  const passVswr = vswrMax <= 2;
  const passReturnLoss = returnLossMin >= 14;
  const passCableLoss = cableLossAt1GHz <= 1.2;
  const passReflection = reflectedPowerMax <= 10;
  const overallPass = passVswr && passReturnLoss && passCableLoss && passReflection;

  const insights = [];
  if (overallPass) {
    insights.push('System is within typical field acceptance limits.');
  }
  if (!passReturnLoss) {
    insights.push('Return loss is below target; inspect connector mating and antenna match.');
  }
  if (!passVswr) {
    insights.push('VSWR is elevated; verify cable continuity and antenna frequency coverage.');
  }
  if (!passCableLoss) {
    insights.push('Cable loss exceeds budget; reduce run length or switch to lower-loss cable.');
  }
  if (faultDistanceFt) {
    insights.push(`A reflection discontinuity appears near ${faultDistanceFt.toFixed(1)} ft.`);
  }
  if (!insights.length) {
    insights.push('No critical issues detected.');
  }

  return {
    freqs,
    returnLossSeries,
    vswrSeries,
    cableLossSeries,
    s11PhaseSeries,
    dtfSeries,
    summary: {
      overallPass,
      vswrMax,
      returnLossMin,
      cableLossAt1GHz,
      reflectedPowerMax,
      dtfPeak,
      faultDistanceFt,
      singlePortLoss,
    },
    insights,
  };
}

function MiniChart({
  xValues,
  yValues,
  yMin,
  yMax,
  color,
  area = false,
  xLabel,
  yLabel,
  formatX,
  formatY,
  markers = [],
  onPlaceMarker,
  activeMarkerLabel,
}) {
  const width = 640;
  const height = 248;
  const margin = { top: 16, right: 18, bottom: 38, left: 52 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  if (!xValues.length || !yValues.length) {
    return null;
  }

  const xMin = xValues[0];
  const xMax = xValues[xValues.length - 1];
  const yLow = yMin ?? Math.min(...yValues);
  const yHigh = yMax ?? Math.max(...yValues);
  const usableRange = Math.max(0.00001, yHigh - yLow);

  const toX = (x) => margin.left + ((x - xMin) / Math.max(0.00001, xMax - xMin)) * plotWidth;
  const toY = (y) => margin.top + ((yHigh - y) / usableRange) * plotHeight;
  const getYAtX = (xTarget) => {
    if (xTarget <= xValues[0]) return yValues[0];
    if (xTarget >= xValues[xValues.length - 1]) return yValues[yValues.length - 1];
    for (let i = 1; i < xValues.length; i += 1) {
      if (xValues[i] >= xTarget) {
        const leftX = xValues[i - 1];
        const rightX = xValues[i];
        const leftY = yValues[i - 1];
        const rightY = yValues[i];
        const ratio = (xTarget - leftX) / Math.max(0.00001, rightX - leftX);
        return leftY + ((rightY - leftY) * ratio);
      }
    }
    return yValues[yValues.length - 1];
  };

  const path = yValues
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${toX(xValues[index]).toFixed(2)} ${toY(value).toFixed(2)}`)
    .join(' ');

  const fillPath = `${path} L ${toX(xValues[xValues.length - 1]).toFixed(2)} ${(margin.top + plotHeight).toFixed(2)} L ${toX(xValues[0]).toFixed(2)} ${(margin.top + plotHeight).toFixed(2)} Z`;

  return (
    <svg
      className="caa-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${yLabel} versus ${xLabel}`}
      onClick={onPlaceMarker ? (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const svgX = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * width;
        const clampedPlotX = clamp(svgX, margin.left, margin.left + plotWidth);
        const ratio = (clampedPlotX - margin.left) / Math.max(0.00001, plotWidth);
        const nextXValue = xMin + ((xMax - xMin) * ratio);
        onPlaceMarker(nextXValue);
      } : undefined}
    >
      <rect x="0" y="0" width={width} height={height} rx="10" className="caa-chart__bg" />
      {[0, 1, 2, 3, 4, 5].map((step) => {
        const y = margin.top + ((plotHeight / 5) * step);
        return <line key={`gy-${step}`} x1={margin.left} y1={y} x2={margin.left + plotWidth} y2={y} className="caa-chart__grid" />;
      })}
      {[0, 1, 2, 3, 4, 5].map((step) => {
        const x = margin.left + ((plotWidth / 5) * step);
        return <line key={`gx-${step}`} x1={x} y1={margin.top} x2={x} y2={margin.top + plotHeight} className="caa-chart__grid" />;
      })}

      {area ? <path d={fillPath} className="caa-chart__area" style={{ '--line-color': color }} /> : null}
      <path d={path} className="caa-chart__line" style={{ '--line-color': color }} />
      {markers.map((marker) => {
        const markerYValue = getYAtX(marker.xValue);
        const markerX = toX(marker.xValue);
        const markerY = toY(markerYValue);
        return (
          <g key={marker.label}>
            <line
              x1={markerX}
              y1={margin.top}
              x2={markerX}
              y2={margin.top + plotHeight}
              className="caa-chart__marker-line"
            />
            <circle
              cx={markerX}
              cy={markerY}
              r={4}
              className={activeMarkerLabel === marker.label ? 'caa-chart__marker-point caa-chart__marker-point--active' : 'caa-chart__marker-point'}
            />
            <text x={markerX + 5} y={markerY - 6} className="caa-chart__marker-label">
              {marker.label}
            </text>
          </g>
        );
      })}

      {[0, 1, 2, 3, 4, 5].map((step) => {
        const value = yHigh - ((usableRange / 5) * step);
        const y = margin.top + ((plotHeight / 5) * step);
        return (
          <text key={`yt-${step}`} x={margin.left - 8} y={y + 4} textAnchor="end" className="caa-chart__tick">
            {formatY(value)}
          </text>
        );
      })}
      {[0, 1, 2, 3, 4, 5].map((step) => {
        const value = xMin + (((xMax - xMin) / 5) * step);
        const x = margin.left + ((plotWidth / 5) * step);
        return (
          <text key={`xt-${step}`} x={x} y={height - 14} textAnchor="middle" className="caa-chart__tick">
            {formatX(value)}
          </text>
        );
      })}

      <text x={margin.left + (plotWidth / 2)} y={height - 2} textAnchor="middle" className="caa-chart__axis-label">
        {xLabel}
      </text>
      <text
        x="14"
        y={margin.top + (plotHeight / 2)}
        transform={`rotate(-90 14 ${margin.top + (plotHeight / 2)})`}
        textAnchor="middle"
        className="caa-chart__axis-label"
      >
        {yLabel}
      </text>
    </svg>
  );
}

function gammaFromImpedance(resistance, reactance) {
  const denom = ((resistance + 1) * (resistance + 1)) + (reactance * reactance);
  return {
    re: (((resistance * resistance) + (reactance * reactance) - 1) / Math.max(0.00001, denom)),
    im: ((2 * reactance) / Math.max(0.00001, denom)),
  };
}

function SmithChart({
  points,
  markers = [],
  onPlaceMarker,
  activeMarkerLabel,
}) {
  const width = 760;
  const height = 520;
  const margin = { top: 22, right: 26, bottom: 42, left: 34 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const radius = Math.min(plotWidth, plotHeight) * 0.485;
  const centerX = margin.left + (plotWidth / 2);
  const centerY = margin.top + (plotHeight / 2);

  if (!points.length) {
    return null;
  }

  const toX = (re) => centerX + (re * radius);
  const toY = (im) => centerY - (im * radius);
  const buildContourPath = (resolver, start, stop, steps = 120) => {
    let path = '';
    for (let i = 0; i <= steps; i += 1) {
      const t = start + (((stop - start) * i) / Math.max(1, steps));
      const gamma = resolver(t);
      const x = toX(gamma.re).toFixed(2);
      const y = toY(gamma.im).toFixed(2);
      path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    }
    return path.trim();
  };

  const tracePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(point.gammaRe).toFixed(2)} ${toY(point.gammaIm).toFixed(2)}`)
    .join(' ');
  const resistanceContours = [0, 0.2, 0.5, 1, 2, 5];
  const reactanceContours = [0.2, 0.5, 1, 2, 5, -0.2, -0.5, -1, -2, -5];

  return (
    <svg
      className="caa-chart caa-smith-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Smith chart for S11 reflection coefficient"
      onClick={onPlaceMarker ? (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const svgX = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * width;
        const svgY = ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * height;
        const rawRe = (svgX - centerX) / Math.max(0.00001, radius);
        const rawIm = (centerY - svgY) / Math.max(0.00001, radius);
        const magnitude = Math.hypot(rawRe, rawIm);
        const gamma = magnitude > 1
          ? { re: rawRe / magnitude, im: rawIm / magnitude }
          : { re: rawRe, im: rawIm };
        onPlaceMarker(gamma);
      } : undefined}
    >
      <rect x="0" y="0" width={width} height={height} rx="10" className="caa-chart__bg" />
      <circle cx={centerX} cy={centerY} r={radius} className="caa-smith-chart__outer" />
      <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} className="caa-smith-chart__axis" />

      {resistanceContours.map((resistance) => (
        <path
          key={`smith-r-${resistance}`}
          d={buildContourPath((reactance) => gammaFromImpedance(resistance, reactance), -8, 8)}
          className="caa-smith-chart__grid"
        />
      ))}
      {reactanceContours.map((reactance) => (
        <path
          key={`smith-x-${reactance}`}
          d={buildContourPath((resistance) => gammaFromImpedance(resistance, reactance), 0, 8)}
          className="caa-smith-chart__grid"
        />
      ))}

      <path d={tracePath} className="caa-smith-chart__trace" />
      {markers.map((marker) => (
        <g key={marker.label}>
          <circle
            cx={toX(marker.gammaRe)}
            cy={toY(marker.gammaIm)}
            r={4}
            className={activeMarkerLabel === marker.label ? 'caa-chart__marker-point caa-chart__marker-point--active' : 'caa-chart__marker-point'}
          />
          <text
            x={toX(marker.gammaRe) + 6}
            y={toY(marker.gammaIm) - 6}
            className="caa-chart__marker-label"
          >
            {marker.label}
          </text>
        </g>
      ))}

      <text x={centerX} y={height - 6} textAnchor="middle" className="caa-chart__axis-label">
        Re(Γ) / Im(Γ) Smith plane
      </text>
    </svg>
  );
}

function sectionTitle(title, index) {
  return (
    <h3 className="caa-panel__section-title">
      <span>{index}</span>
      {title}
    </h3>
  );
}

function VariableLink({ label, variable, onOpenHelp }) {
  const entry = VARIABLE_GUIDE.find((item) => item.variable === variable);
  const tooltip = entry
    ? `${entry.variable}: ${entry.meaning} Good default: ${entry.defaultValue}. ${entry.note}`
    : label;

  return (
    <button
      type="button"
      className="caa-var-link"
      title={tooltip}
      aria-label={`${label}. ${tooltip}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpenHelp();
      }}
    >
      {label}
    </button>
  );
}

export default function CableAntennaAnalyzer() {
  const defaultCable = CABLE_OPTIONS[0];
  const defaultAntenna = ANTENNA_OPTIONS[0];
  const recommendedDefaults = {
    units: 'ft',
    cableType: defaultCable.value,
    lengthFt: 100,
    impedance: defaultCable.impedance,
    velocityFactor: defaultCable.vf,
    lossAt1GHz: defaultCable.lossAt1GHz,
    cableCondition: 'Good',
    nearConnectorType: 'n_type',
    nearGender: 'Male',
    nearCondition: 'Good',
    nearTorque: 'Proper',
    nearAdapters: 0,
    farConnectorType: 'n_type',
    farGender: 'Male',
    farCondition: 'Good',
    farTorque: 'Proper',
    farAdapters: 0,
    antennaType: defaultAntenna.type,
    antennaModel: defaultAntenna.value,
    matchQuality: 'Good',
    environment: 'Outdoor - Clear',
    startMHz: 600,
    stopMHz: 3000,
    points: 161,
    calibration: '1-Port (Open/Short/Load)',
    dtfRangeFt: 150,
    dtfResolutionFt: 1,
  };

  const [config, setConfig] = useState({
    ...recommendedDefaults,
  });
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('build');
  const [activeTab, setActiveTab] = useState('returnLoss');
  const [selectedScenario, setSelectedScenario] = useState('good');
  const [appliedScenario, setAppliedScenario] = useState('good');
  const [severity, setSeverity] = useState(30);
  const [sweepType, setSweepType] = useState('Linear');
  const [sweepAveraging, setSweepAveraging] = useState(2);
  const [displayFormat, setDisplayFormat] = useState('Log Mag');
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepProgress, setSweepProgress] = useState(100);
  const [sweepMode, setSweepMode] = useState('continuous');
  const [sweepSession, setSweepSession] = useState(0);
  const [learnTopicId, setLearnTopicId] = useState('mismatch');
  const [learnMismatch, setLearnMismatch] = useState(30);
  const [learnCableStress, setLearnCableStress] = useState(25);
  const [learnReflectionMode, setLearnReflectionMode] = useState('connector');
  const [learnReflectionSeverity, setLearnReflectionSeverity] = useState(35);
  const [learnChartMode, setLearnChartMode] = useState('returnLoss');
  const [learnQuizAnswers, setLearnQuizAnswers] = useState({});
  const [learnNotes, setLearnNotes] = useState('');
  const [activeMarker, setActiveMarker] = useState('M1');
  const [markerRatios, setMarkerRatios] = useState({ M1: 0.56, M2: 0.15, M3: 0.84 });
  const [selectedDiagnosisIssueId, setSelectedDiagnosisIssueId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [seed, setSeed] = useState(1);
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const update = (key, value) => {
    setConfig((previous) => ({ ...previous, [key]: value }));
  };
  const showToast = (message) => {
    setToastMessage(message);
  };
  const triggerDownload = (filename, content, mimeType) => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  };

  const antennaForType = ANTENNA_OPTIONS.filter((item) => item.type === config.antennaType);

  const primaryResults = useMemo(
    () => simulate(config, appliedScenario, severity, seed),
    [config, appliedScenario, severity, seed],
  );

  const baselineResults = useMemo(
    () => simulate(config, 'good', 0, 1),
    [config],
  );

  const previewResults = useMemo(
    () => simulate(config, selectedScenario, severity, seed),
    [config, selectedScenario, severity, seed],
  );

  const lengthDisplay = config.units === 'ft'
    ? config.lengthFt
    : config.lengthFt / FT_PER_M;
  const dtfRangeDisplay = config.units === 'ft'
    ? config.dtfRangeFt
    : config.dtfRangeFt / FT_PER_M;

  const scenarioEntries = Object.entries(SCENARIOS);
  const isBuildView = activeWorkspaceTab === 'build';
  const isMeasureView = activeWorkspaceTab === 'measure';
  const isDiagnoseView = activeWorkspaceTab === 'diagnose';
  const isLearnView = activeWorkspaceTab === 'learn';

  const currentChart = (() => {
    if (activeTab === 'vswr') {
      return {
        xValues: primaryResults.freqs,
        yValues: primaryResults.vswrSeries,
        yMin: 1,
        yMax: Math.max(2.5, Math.ceil(Math.max(...primaryResults.vswrSeries) * 10) / 10),
        color: '#49a6ff',
        xLabel: 'Frequency (MHz)',
        yLabel: 'VSWR',
        formatX: (value) => value.toFixed(0),
        formatY: (value) => value.toFixed(2),
        area: false,
      };
    }
    if (activeTab === 'cableLoss') {
      return {
        xValues: primaryResults.freqs,
        yValues: primaryResults.cableLossSeries,
        yMin: 0,
        yMax: Math.max(2.2, Math.ceil(Math.max(...primaryResults.cableLossSeries) * 10) / 10),
        color: '#9bd268',
        xLabel: 'Frequency (MHz)',
        yLabel: 'Loss (dB)',
        formatX: (value) => value.toFixed(0),
        formatY: (value) => value.toFixed(2),
        area: true,
      };
    }
    if (activeTab === 'smithChart') {
      return {
        xValues: primaryResults.freqs,
        yValues: primaryResults.returnLossSeries,
        yMin: 0,
        yMax: 40,
        color: '#7ec0ff',
        xLabel: 'Frequency (MHz)',
        yLabel: 'Return Loss (dB)',
        formatX: (value) => value.toFixed(0),
        formatY: (value) => value.toFixed(1),
        area: false,
      };
    }
    if (activeTab === 'dtf') {
      const xValues = primaryResults.dtfSeries.map((_, index) => (config.dtfRangeFt * index) / (primaryResults.dtfSeries.length - 1));
      return {
        xValues,
        yValues: primaryResults.dtfSeries,
        yMin: -40,
        yMax: 0,
        color: '#b677ff',
        xLabel: `Distance (${config.units})`,
        yLabel: 'DTF Return (dB)',
        formatX: (value) => {
          const unitValue = config.units === 'ft' ? value : value / FT_PER_M;
          return unitValue.toFixed(0);
        },
        formatY: (value) => value.toFixed(0),
        area: true,
      };
    }
    if (activeTab === 's11Phase') {
      return {
        xValues: primaryResults.freqs,
        yValues: primaryResults.s11PhaseSeries,
        yMin: -180,
        yMax: 180,
        color: '#ffd05a',
        xLabel: 'Frequency (MHz)',
        yLabel: 'Phase (deg)',
        formatX: (value) => value.toFixed(0),
        formatY: (value) => value.toFixed(0),
        area: false,
      };
    }
    return {
      xValues: primaryResults.freqs,
      yValues: primaryResults.returnLossSeries,
      yMin: 0,
      yMax: 40,
      color: activeWorkspaceTab === 'measure' ? '#f1d45a' : '#43e197',
      xLabel: 'Frequency (MHz)',
      yLabel: 'Return Loss (dB)',
      formatX: (value) => value.toFixed(0),
      formatY: (value) => value.toFixed(0),
      area: true,
    };
  })();
  const measureVisibleCount = isMeasureView
    ? Math.max(2, Math.round(currentChart.xValues.length * clamp(sweepProgress / 100, 0.02, 1)))
    : currentChart.xValues.length;
  const measuredChart = isMeasureView
    ? {
      ...currentChart,
      xValues: currentChart.xValues.slice(0, measureVisibleCount),
      yValues: currentChart.yValues.slice(0, measureVisibleCount).map((value, index) => {
        if (!isSweeping) return value;
        const wobble = activeTab === 'vswr'
          ? noise(index, sweepSession * 0.91, 0.035)
          : activeTab === 's11Phase'
            ? noise(index, sweepSession * 0.84, 3.2)
            : noise(index, sweepSession * 0.77, 0.7);
        return value + wobble;
      }),
    }
    : currentChart;
  const chartForDisplay = isMeasureView ? measuredChart : currentChart;
  const smithPoints = useMemo(() => {
    const visibleCount = clamp(measureVisibleCount, 1, primaryResults.freqs.length);
    return primaryResults.freqs.slice(0, visibleCount).map((freqMHz, index) => {
      const returnLossDb = primaryResults.returnLossSeries[index];
      const phaseDeg = primaryResults.s11PhaseSeries[index];
      const gammaMag = clamp(Math.pow(10, -(returnLossDb / 20)), 0.0001, 0.999);
      const phaseRad = (phaseDeg * Math.PI) / 180;
      return {
        freqMHz,
        returnLossDb,
        phaseDeg,
        gammaMag,
        gammaRe: gammaMag * Math.cos(phaseRad),
        gammaIm: gammaMag * Math.sin(phaseRad),
      };
    });
  }, [
    measureVisibleCount,
    primaryResults.freqs,
    primaryResults.returnLossSeries,
    primaryResults.s11PhaseSeries,
  ]);

  const overallBadgeClass = primaryResults.summary.overallPass ? 'caa-status__value caa-status__value--pass' : 'caa-status__value caa-status__value--fail';
  const displayedFaultDistance = primaryResults.summary.faultDistanceFt
    ? (config.units === 'ft'
      ? `${primaryResults.summary.faultDistanceFt.toFixed(1)} ft`
      : `${(primaryResults.summary.faultDistanceFt / FT_PER_M).toFixed(1)} m`)
    : '—';
  const selectedCable = CABLE_OPTIONS.find((item) => item.value === config.cableType) || defaultCable;
  const selectedNearConnector = CONNECTOR_OPTIONS.find((item) => item.value === config.nearConnectorType) || CONNECTOR_OPTIONS[0];
  const selectedFarConnector = CONNECTOR_OPTIONS.find((item) => item.value === config.farConnectorType) || CONNECTOR_OPTIONS[0];
  const selectedAntenna = ANTENNA_OPTIONS.find((item) => item.value === config.antennaModel) || defaultAntenna;
  const formatDistance = (distanceFt) => (
    config.units === 'ft'
      ? `${distanceFt.toFixed(1)} ft`
      : `${(distanceFt / FT_PER_M).toFixed(1)} m`
  );
  const buildSnapshot = [
    { label: 'Cable + Length', value: `${selectedCable.label}, ${formatDistance(config.lengthFt)}` },
    { label: 'Connectors', value: `${selectedNearConnector.label} (${config.nearGender}) -> ${selectedFarConnector.label} (${config.farGender})` },
    { label: 'Antenna', value: `${selectedAntenna.label} (${selectedAntenna.type})` },
    { label: 'Sweep', value: `${config.startMHz}-${config.stopMHz} MHz (${config.points} pts)` },
    { label: 'Calibration', value: config.calibration },
    {
      label: 'DTF',
      value: `${formatDistance(config.dtfRangeFt)} range, ${
        config.units === 'ft'
          ? `${config.dtfResolutionFt.toFixed(1)} ft`
          : `${(config.dtfResolutionFt / FT_PER_M).toFixed(2)} m`
      } step`,
    },
  ];
  const learnScenarioKey = learnReflectionMode === 'open'
    ? 'open'
    : learnReflectionMode === 'short'
      ? 'short'
      : learnReflectionMode === 'water'
        ? 'water'
        : 'loose';
  const learnConfig = useMemo(() => {
    const mismatchAdapterBoost = Math.round(learnMismatch / 40);
    return {
      ...config,
      lossAt1GHz: clamp(config.lossAt1GHz * (1 + (learnCableStress / 130)), 0.05, 2),
      lengthFt: clamp(config.lengthFt * (1 + (learnCableStress / 260)), 1, 2000),
      nearAdapters: clamp(config.nearAdapters + mismatchAdapterBoost, 0, 4),
      farAdapters: clamp(config.farAdapters + Math.round(learnMismatch / 55), 0, 4),
      matchQuality: learnMismatch < 20 ? 'Excellent' : learnMismatch < 45 ? 'Good' : learnMismatch < 70 ? 'Fair' : 'Marginal',
      cableCondition: learnCableStress < 25 ? 'Good' : learnCableStress < 55 ? 'Used' : 'Poor',
    };
  }, [config, learnCableStress, learnMismatch]);
  const learnSimResults = useMemo(
    () => simulate(learnConfig, learnScenarioKey, learnReflectionSeverity, seed + 101),
    [learnConfig, learnScenarioKey, learnReflectionSeverity, seed],
  );
  const learnTopic = LEARN_TOPIC_CATALOG.find((topic) => topic.id === learnTopicId) || LEARN_TOPIC_CATALOG[0];
  const learnForwardPct = clamp(100 - (learnSimResults.summary.reflectedPowerMax + (learnSimResults.summary.cableLossAt1GHz * 5.4)), 8, 100);
  const learnLossPct = clamp(learnSimResults.summary.cableLossAt1GHz * 5.4, 0, 70);
  const learnReflectedPct = clamp(learnSimResults.summary.reflectedPowerMax, 0, 90);
  const learnComparisonRows = [
    {
      metric: 'Return Loss (Min)',
      baseline: `${baselineResults.summary.returnLossMin.toFixed(1)} dB`,
      lab: `${learnSimResults.summary.returnLossMin.toFixed(1)} dB`,
      delta: `${(learnSimResults.summary.returnLossMin - baselineResults.summary.returnLossMin).toFixed(1)} dB`,
    },
    {
      metric: 'VSWR (Max)',
      baseline: `${baselineResults.summary.vswrMax.toFixed(2)}:1`,
      lab: `${learnSimResults.summary.vswrMax.toFixed(2)}:1`,
      delta: `${(learnSimResults.summary.vswrMax - baselineResults.summary.vswrMax).toFixed(2)}:1`,
    },
    {
      metric: 'Cable Loss @ 1 GHz',
      baseline: `${baselineResults.summary.cableLossAt1GHz.toFixed(2)} dB`,
      lab: `${learnSimResults.summary.cableLossAt1GHz.toFixed(2)} dB`,
      delta: `${(learnSimResults.summary.cableLossAt1GHz - baselineResults.summary.cableLossAt1GHz).toFixed(2)} dB`,
    },
    {
      metric: 'Reflected Power (Max)',
      baseline: `${baselineResults.summary.reflectedPowerMax.toFixed(1)} %`,
      lab: `${learnSimResults.summary.reflectedPowerMax.toFixed(1)} %`,
      delta: `${(learnSimResults.summary.reflectedPowerMax - baselineResults.summary.reflectedPowerMax).toFixed(1)} %`,
    },
  ];
  const learnChart = learnChartMode === 'vswr'
    ? {
      baselineY: baselineResults.vswrSeries,
      labY: learnSimResults.vswrSeries,
      yMin: 1,
      yMax: Math.max(2.8, Math.ceil(Math.max(...learnSimResults.vswrSeries) * 10) / 10),
      color: '#67b8ff',
      yLabel: 'VSWR',
      formatY: (value) => value.toFixed(2),
      title: 'VSWR Response',
    }
    : {
      baselineY: baselineResults.returnLossSeries,
      labY: learnSimResults.returnLossSeries,
      yMin: 0,
      yMax: 40,
      color: '#f1d45a',
      yLabel: 'Return Loss (dB)',
      formatY: (value) => value.toFixed(1),
      title: 'Return Loss Response',
    };
  const learnRealWorldExamples = [
    `Urban rooftop macro: connector mismatch event can push VSWR to ${learnSimResults.summary.vswrMax.toFixed(2)}:1 and reduce return loss margin.`,
    `Rural long-run feedline: cable stress at ${learnCableStress}% simulates moisture/age effects and raises insertion loss trend.`,
    `Tower-top maintenance case: reflection mode "${learnReflectionMode}" shows DTF hotspot behavior near ${formatDistance(learnSimResults.summary.faultDistanceFt || (config.lengthFt * 0.52))}.`,
  ];
  const learnQuizScore = LEARN_QUIZ_ITEMS.reduce((score, quiz) => (
    learnQuizAnswers[quiz.id] === quiz.correctIndex ? score + 1 : score
  ), 0);
  const diagnoseChecklist = [
    `Start from Good System baseline, then apply ${SCENARIOS[selectedScenario].label}.`,
    `Increase severity gradually (now ${severity}%) and watch VSWR/return-loss deltas.`,
    `Confirm DTF estimate (${displayedFaultDistance}) against expected cable path.`,
  ];
  const measureModeTabs = [
    { id: 'returnLoss', label: 'Magnitude' },
    { id: 'vswr', label: 'VSWR' },
    { id: 's11Phase', label: 'Phase' },
    { id: 'cableLoss', label: 'Cable Loss' },
    { id: 'smithChart', label: 'Smith Chart' },
  ];
  const measureTraceRows = [
    { id: 'returnLoss', label: 'S11 (Return Loss)' },
    { id: 'vswr', label: 'S11 (VSWR)' },
    { id: 's11Phase', label: 'S11 (Phase)' },
    { id: 'cableLoss', label: 'Cable Loss' },
    { id: 'smithChart', label: 'S11 (Smith Chart)' },
  ];
  const average = (series) => series.reduce((sum, value) => sum + value, 0) / Math.max(series.length, 1);
  const visibleReturnLoss = primaryResults.returnLossSeries.slice(0, measureVisibleCount);
  const visibleVswr = primaryResults.vswrSeries.slice(0, measureVisibleCount);
  const measureSummaryRows = [
    { label: 'Min Return Loss', value: `${Math.min(...visibleReturnLoss).toFixed(1)} dB` },
    { label: 'Max Return Loss', value: `${Math.max(...visibleReturnLoss).toFixed(1)} dB` },
    { label: 'Avg Return Loss', value: `${average(visibleReturnLoss).toFixed(1)} dB` },
    { label: 'Min VSWR', value: `${Math.min(...visibleVswr).toFixed(2)}:1` },
    { label: 'Max VSWR', value: `${Math.max(...visibleVswr).toFixed(2)}:1` },
    { label: 'Avg VSWR', value: `${average(visibleVswr).toFixed(2)}:1` },
  ];
  const markerRows = ['M1', 'M2', 'M3'].map((markerLabel) => {
    const ratio = markerRatios[markerLabel] ?? 0;
    const markerIndex = Math.round((chartForDisplay.xValues.length - 1) * ratio);
    const xValue = chartForDisplay.xValues[markerIndex];
    const yValue = chartForDisplay.yValues[markerIndex];
    const smithPoint = smithPoints[Math.min(smithPoints.length - 1, Math.max(0, markerIndex))];
    const axisValue = chartForDisplay.xLabel.includes('Frequency')
      ? `${(xValue / 1000).toFixed(3)} GHz`
      : `${xValue.toFixed(1)} ${config.units}`;
    const markerValue = activeTab === 'vswr'
      ? `${yValue.toFixed(2)}:1`
      : activeTab === 's11Phase'
        ? `${yValue.toFixed(1)} deg`
        : activeTab === 'smithChart'
          ? `Γ ${smithPoint.gammaRe >= 0 ? '+' : ''}${smithPoint.gammaRe.toFixed(2)} ${smithPoint.gammaIm >= 0 ? '+' : ''}${smithPoint.gammaIm.toFixed(2)}j`
          : `${yValue.toFixed(1)} dB`;
    return {
      marker: markerLabel,
      axisValue,
      markerValue,
      ratio,
      xValue,
      gammaRe: smithPoint.gammaRe,
      gammaIm: smithPoint.gammaIm,
    };
  });
  const chartMarkers = markerRows.map((row) => ({
    label: row.marker,
    xValue: row.xValue,
    gammaRe: row.gammaRe,
    gammaIm: row.gammaIm,
  }));
  const diagnoseAnalysis = useMemo(() => {
    const issues = [];
    const severityWeights = { critical: 30, high: 20, medium: 12, low: 6 };
    const severityPriority = { critical: 4, high: 3, medium: 2, low: 1 };
    let penalty = 0;
    const addIssue = (issue, weightOverride) => {
      issues.push(issue);
      penalty += weightOverride ?? severityWeights[issue.severity] ?? 10;
    };

    const metrics = {
      returnLossMin: primaryResults.summary.returnLossMin,
      vswrMax: primaryResults.summary.vswrMax,
      cableLossAt1GHz: primaryResults.summary.cableLossAt1GHz,
      dtfPeak: primaryResults.summary.dtfPeak,
      reflectedPowerMax: primaryResults.summary.reflectedPowerMax,
    };

    const vswrDelta = metrics.vswrMax - baselineResults.summary.vswrMax;
    const returnLossDelta = baselineResults.summary.returnLossMin - metrics.returnLossMin;
    const dtfDistanceSeries = primaryResults.dtfSeries.map(
      (_, index) => (config.dtfRangeFt * index) / Math.max(primaryResults.dtfSeries.length - 1, 1),
    );
    const dtfHotspots = primaryResults.dtfSeries
      .map((value, index) => ({ value, distanceFt: dtfDistanceSeries[index] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    const strongestReflection = dtfHotspots[0] || null;
    const inferredFaultFt = primaryResults.summary.faultDistanceFt
      ?? ((strongestReflection && strongestReflection.value > -19) ? strongestReflection.distanceFt : null);

    if (metrics.vswrMax > 2.0) {
      const severity = metrics.vswrMax > 2.6 ? 'critical' : metrics.vswrMax > 2.25 ? 'high' : 'medium';
      addIssue({
        id: 'vswr-high',
        title: 'Elevated VSWR envelope',
        severity,
        explanation: `Max VSWR reached ${metrics.vswrMax.toFixed(2)}:1, above the 2.0:1 acceptance target.`,
        recommendations: [
          'Inspect near and far connector torque/condition, then retest.',
          'Confirm antenna model matches the sweep band and intended deployment.',
          'Run a baseline Good System sweep for A/B comparison.',
        ],
        drilldown: {
          whyItHappens: 'High VSWR typically indicates impedance mismatch introduced by connectors, cable damage, or antenna mismatch.',
          validationSteps: [
            `Compare baseline delta: VSWR increased by ${vswrDelta.toFixed(2)}:1.`,
            `Cross-check return loss floor (${metrics.returnLossMin.toFixed(1)} dB) for matching degradation.`,
            'Inspect if VSWR rise is broadband (systemic) or localized (single discontinuity).',
          ],
        },
      });
    }

    if (metrics.returnLossMin < 14) {
      const severity = metrics.returnLossMin < 10 ? 'critical' : metrics.returnLossMin < 12 ? 'high' : 'medium';
      addIssue({
        id: 'return-loss-low',
        title: 'Return loss below threshold',
        severity,
        explanation: `Minimum return loss is ${metrics.returnLossMin.toFixed(1)} dB (target >= 14 dB).`,
        recommendations: [
          'Clean and reseat connectors, then repeat calibration and sweep.',
          'Verify adapter count and transition quality along the feed line.',
          'Check antenna feedpoint for moisture or corrosion.',
        ],
        drilldown: {
          whyItHappens: 'Low return loss indicates excessive reflected energy from mismatch points in the RF path.',
          validationSteps: [
            `Return loss degraded by ${returnLossDelta.toFixed(1)} dB versus baseline.`,
            'Correlate dips with DTF hotspots to isolate likely physical locations.',
            'Re-run sweep with reduced adapters to see if floor improves.',
          ],
        },
      });
    }

    if (metrics.cableLossAt1GHz > 1.2) {
      const severity = metrics.cableLossAt1GHz > 1.8 ? 'high' : 'medium';
      addIssue({
        id: 'cable-loss-high',
        title: 'Cable insertion loss over budget',
        severity,
        explanation: `Cable loss at 1 GHz is ${metrics.cableLossAt1GHz.toFixed(2)} dB (budget <= 1.2 dB).`,
        recommendations: [
          'Validate cable type/length assumptions in Build settings.',
          'Inspect for water ingress, crushing, or sharp-bend stress points.',
          'Consider lower-loss cable for long-run deployments.',
        ],
        drilldown: {
          whyItHappens: 'Excess insertion loss can be caused by aging cable dielectric, water ingress, poor transitions, or excessive run length.',
          validationSteps: [
            `Configured cable: ${selectedCable.label} at ${formatDistance(config.lengthFt)}.`,
            `Applied scenario: ${SCENARIOS[appliedScenario].label}.`,
            'Compare near/far connector conditions for asymmetry effects.',
          ],
        },
      });
    }

    if (metrics.reflectedPowerMax > 10) {
      const severity = metrics.reflectedPowerMax > 20 ? 'critical' : 'high';
      addIssue({
        id: 'reflected-power',
        title: 'Reflected power risk',
        severity,
        explanation: `Peak reflected power reached ${metrics.reflectedPowerMax.toFixed(1)}% (target <= 10%).`,
        recommendations: [
          'Do not increase transmit power until mismatch is corrected.',
          'Prioritize connector and antenna feedpoint inspection.',
          'Re-sweep after corrective action to verify reflected power reduction.',
        ],
        drilldown: {
          whyItHappens: 'High reflected power is a direct byproduct of mismatch and can reduce PA efficiency or trigger protection behavior.',
          validationSteps: [
            `VSWR max and return loss floor both indicate mismatch severity.`,
            'Check if reflected power spikes align with specific frequency regions.',
            'Use DTF to inspect candidate discontinuity points.',
          ],
        },
      });
    }

    if (strongestReflection && strongestReflection.value > -18) {
      const severity = strongestReflection.value > -12 ? 'high' : 'medium';
      addIssue({
        id: 'dtf-hotspot',
        title: 'Strong DTF reflection hotspot',
        severity,
        explanation: `Strongest DTF return is ${strongestReflection.value.toFixed(1)} dB near ${formatDistance(strongestReflection.distanceFt)}.`,
        recommendations: [
          `Inspect feed line near ${formatDistance(strongestReflection.distanceFt)} for connectors, bends, or damage.`,
          'Compare with known cable map and enclosure transition points.',
          'After repair, rerun DTF to confirm hotspot reduction.',
        ],
        drilldown: {
          whyItHappens: 'DTF peaks indicate impedance discontinuities along the transmission line distance axis.',
          validationSteps: [
            `Top hotspot: ${strongestReflection.value.toFixed(1)} dB at ${formatDistance(strongestReflection.distanceFt)}.`,
            `Second hotspot: ${dtfHotspots[1] ? `${dtfHotspots[1].value.toFixed(1)} dB at ${formatDistance(dtfHotspots[1].distanceFt)}` : 'not significant'}.`,
            'Cross-validate against physical jumpers, adapters, and weather-sealed joints.',
          ],
        },
      });
    }

    if (!issues.length) {
      addIssue({
        id: 'healthy-baseline',
        title: 'No major RF degradations detected',
        severity: 'low',
        explanation: 'All measured indicators remain within typical field acceptance thresholds.',
        recommendations: [
          'Capture this sweep as baseline reference for future troubleshooting.',
          'Monitor trend drift periodically to detect early degradation.',
        ],
        drilldown: {
          whyItHappens: 'System configuration and measured responses appear well-matched across the sweep range.',
          validationSteps: [
            'Store this session with date/time and installation notes.',
            'Use the same sweep setup for future change detection.',
          ],
        },
      }, 0);
    }

    const healthScore = clamp(Math.round(100 - penalty), 0, 100);
    const healthBand = healthScore >= 90
      ? 'Healthy'
      : healthScore >= 75
        ? 'Watch'
        : healthScore >= 55
          ? 'Degraded'
          : 'Critical';
    const recommendationMap = new Map();
    issues.forEach((issue) => {
      const priority = severityPriority[issue.severity] ?? 1;
      issue.recommendations.forEach((recommendation) => {
        const current = recommendationMap.get(recommendation) || 0;
        recommendationMap.set(recommendation, Math.max(current, priority));
      });
    });
    const recommendations = [...recommendationMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([text, priority], index) => ({
        id: `rec-${index + 1}`,
        priority,
        text,
      }));

    return {
      healthScore,
      healthBand,
      metrics,
      issues,
      recommendations,
      inferredFaultFt,
      dtfHotspots,
    };
  }, [
    appliedScenario,
    baselineResults.summary.cableLossAt1GHz,
    baselineResults.summary.returnLossMin,
    baselineResults.summary.vswrMax,
    config.dtfRangeFt,
    config.lengthFt,
    config.units,
    formatDistance,
    primaryResults.dtfSeries,
    primaryResults.summary.cableLossAt1GHz,
    primaryResults.summary.dtfPeak,
    primaryResults.summary.faultDistanceFt,
    primaryResults.summary.reflectedPowerMax,
    primaryResults.summary.returnLossMin,
    primaryResults.summary.vswrMax,
    selectedCable.label,
  ]);
  const selectedDiagnosisIssue = diagnoseAnalysis.issues.find((issue) => issue.id === selectedDiagnosisIssueId)
    || diagnoseAnalysis.issues[0]
    || null;

  const applyScenario = () => {
    setAppliedScenario(selectedScenario);
    setSeed((value) => value + 1);
    showToast(`Applied degradation scenario: ${SCENARIOS[selectedScenario].label}`);
  };
  const startSweep = ({ single = false } = {}) => {
    setIsSweeping(true);
    setSweepMode(single ? 'single' : 'continuous');
    setSweepProgress(0);
    setSweepSession((value) => value + 1);
    if (single) {
      showToast('Single sweep started');
    } else {
      showToast('Continuous sweep started');
    }
  };
  const placeMarkerAtX = (xValue) => {
    const xMin = chartForDisplay.xValues[0];
    const xMax = chartForDisplay.xValues[chartForDisplay.xValues.length - 1];
    const ratio = clamp((xValue - xMin) / Math.max(0.00001, xMax - xMin), 0, 1);
    setMarkerRatios((previous) => ({ ...previous, [activeMarker]: ratio }));
  };
  const placeMarkerOnSmith = (gammaPoint) => {
    if (!smithPoints.length) return;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    smithPoints.forEach((point, index) => {
      const distance = ((point.gammaRe - gammaPoint.re) ** 2) + ((point.gammaIm - gammaPoint.im) ** 2);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    const ratio = smithPoints.length > 1 ? nearestIndex / (smithPoints.length - 1) : 0;
    setMarkerRatios((previous) => ({ ...previous, [activeMarker]: ratio }));
  };
  const exportMeasure = (format) => {
    if (activeTab === 'smithChart') {
      const rows = smithPoints.map((point) => ({
        frequencyMHz: point.freqMHz,
        gammaReal: point.gammaRe,
        gammaImag: point.gammaIm,
        gammaMagnitude: point.gammaMag,
        phaseDeg: point.phaseDeg,
        returnLossDb: point.returnLossDb,
        scenario: SCENARIOS[appliedScenario].label,
        severityPercent: severity,
      }));
      if (format === 'json') {
        triggerDownload(
          'measure-smith-chart.json',
          JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2),
          'application/json',
        );
        showToast('Exported Smith Chart JSON file');
        return;
      }
      const csv = [
        'frequency_mhz,gamma_real,gamma_imag,gamma_mag,phase_deg,return_loss_db,scenario,severity_percent',
        ...rows.map((row) => (
          `${row.frequencyMHz.toFixed(2)},${row.gammaReal.toFixed(5)},${row.gammaImag.toFixed(5)},${row.gammaMagnitude.toFixed(5)},${row.phaseDeg.toFixed(2)},${row.returnLossDb.toFixed(3)},${row.scenario},${row.severityPercent}`
        )),
      ].join('\n');
      triggerDownload('measure-smith-chart.csv', csv, 'text/csv');
      showToast('Exported Smith Chart CSV file');
      return;
    }
    const rows = chartForDisplay.xValues.map((xValue, index) => ({
      frequencyMHz: xValue,
      value: chartForDisplay.yValues[index],
      trace: measureTraceRows.find((item) => item.id === activeTab)?.label || activeTab,
      scenario: SCENARIOS[appliedScenario].label,
      severityPercent: severity,
    }));
    if (format === 'json') {
      triggerDownload(
        `measure-${activeTab}.json`,
        JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2),
        'application/json',
      );
      showToast('Exported JSON file');
      return;
    }
    const csv = [
      'frequency_mhz,value,trace,scenario,severity_percent',
      ...rows.map((row) => `${row.frequencyMHz.toFixed(2)},${row.value.toFixed(4)},${row.trace},${row.scenario},${row.severityPercent}`),
    ].join('\n');
    triggerDownload(`measure-${activeTab}.csv`, csv, 'text/csv');
    showToast('Exported CSV file');
  };

  const applyRecommendedDefaults = ({ closeHelp = false } = {}) => {
    setConfig({ ...recommendedDefaults });
    setSelectedScenario('good');
    setAppliedScenario('good');
    setSeverity(30);
    setSweepType('Linear');
    setSweepAveraging(2);
    setDisplayFormat('Log Mag');
    setIsSweeping(false);
    setSweepProgress(100);
    setSweepMode('continuous');
    setLearnTopicId('mismatch');
    setLearnMismatch(30);
    setLearnCableStress(25);
    setLearnReflectionMode('connector');
    setLearnReflectionSeverity(35);
    setLearnChartMode('returnLoss');
    setLearnQuizAnswers({});
    setLearnNotes('');
    setActiveMarker('M1');
    setMarkerRatios({ M1: 0.56, M2: 0.15, M3: 0.84 });
    setActiveTab('returnLoss');
    setSeed((value) => value + 1);
    if (closeHelp) {
      setShowHelpGuide(false);
    }
  };

  const openHelpGuide = () => {
    setShowHelpGuide(true);
  };

  useEffect(() => {
    if (!isSweeping) return undefined;
    const baseStep = sweepType === 'Log' ? 9 : 6;
    const modeBoost = sweepMode === 'single' ? 1.8 : 1;
    const averagingPenalty = Math.max(1, sweepAveraging);
    const interval = window.setInterval(() => {
      setSweepProgress((previous) => {
        const next = clamp(previous + ((baseStep * modeBoost) / averagingPenalty), 0, 100);
        return next;
      });
      setSweepSession((value) => value + 1);
    }, 140);
    return () => window.clearInterval(interval);
  }, [isSweeping, sweepType, sweepAveraging, sweepMode]);

  useEffect(() => {
    if (!isSweeping || sweepProgress < 100) return;
    setIsSweeping(false);
    setSeed((value) => value + 1);
    showToast('Sweep complete');
  }, [isSweeping, sweepProgress]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeout = window.setTimeout(() => {
      setToastMessage('');
    }, 2200);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    if (!diagnoseAnalysis.issues.length) {
      setSelectedDiagnosisIssueId(null);
      return;
    }
    const exists = diagnoseAnalysis.issues.some((issue) => issue.id === selectedDiagnosisIssueId);
    if (!exists) {
      setSelectedDiagnosisIssueId(diagnoseAnalysis.issues[0].id);
    }
  }, [diagnoseAnalysis.issues, selectedDiagnosisIssueId]);

  useEffect(() => {
    if (!showHelpGuide) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setShowHelpGuide(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showHelpGuide]);

  return (
    <div className="caa">
      <div className="caa-topbar">
        <div className="caa-topbar__brand">
          <strong>Virtual Cable &amp; Antenna Analyzer</strong>
          <span>Train • Simulate • Diagnose</span>
        </div>
        <div className="caa-topbar__tabs">
          {WORKSPACE_TABS.map((tab) => (
            <button
              key={tab.id}
              className={activeWorkspaceTab === tab.id ? 'caa-topbar__tab caa-topbar__tab--active' : 'caa-topbar__tab'}
              type="button"
              onClick={() => setActiveWorkspaceTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="caa-topbar__actions">
          <button className="caa-ghost-btn caa-ghost-btn--help" type="button" onClick={() => setShowHelpGuide(true)}>
            Start Here: Help
          </button>
        </div>
      </div>

      <div className="caa-layout">
        <aside className="caa-panel caa-panel--left">
          {isBuildView ? (
            <>
              {sectionTitle('System Builder', 1)}

              <div className="caa-input-group">
            <h4>Cable</h4>
            <label><VariableLink label="Type" variable="Cable Type" onOpenHelp={openHelpGuide} />
              <select value={config.cableType} onChange={(event) => {
                const picked = CABLE_OPTIONS.find((item) => item.value === event.target.value) || defaultCable;
                update('cableType', picked.value);
                update('impedance', picked.impedance);
                update('velocityFactor', picked.vf);
                update('lossAt1GHz', picked.lossAt1GHz);
              }}>
                {CABLE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Length" variable="Cable Length" onOpenHelp={openHelpGuide} />
              <div className="caa-inline">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={lengthDisplay.toFixed(1)}
                  onChange={(event) => {
                    const numeric = Number(event.target.value) || 0;
                    const asFt = config.units === 'ft' ? numeric : numeric * FT_PER_M;
                    update('lengthFt', clamp(asFt, 1, 2000));
                  }}
                />
                <span className="caa-unit">{config.units}</span>
              </div>
            </label>
            <label><VariableLink label="Impedance" variable="Impedance" onOpenHelp={openHelpGuide} />
              <div className="caa-inline">
                <input
                  type="number"
                  min="25"
                  max="100"
                  step="1"
                  value={config.impedance}
                  onChange={(event) => update('impedance', clamp(Number(event.target.value) || 50, 25, 100))}
                />
                <span className="caa-unit">ohm</span>
              </div>
            </label>
            <label><VariableLink label="Velocity Factor" variable="Velocity Factor" onOpenHelp={openHelpGuide} />
              <input
                type="number"
                min="0.5"
                max="0.95"
                step="0.01"
                value={config.velocityFactor}
                onChange={(event) => update('velocityFactor', clamp(Number(event.target.value) || 0.7, 0.5, 0.95))}
              />
            </label>
            <p className="caa-field-note">
              If unknown: use <strong>0.85</strong> for LMR-400, or <strong>0.66</strong> for RG-58 / RG-213.
            </p>
            <label><VariableLink label="Loss (Typ @ 1 GHz)" variable="Loss @ 1 GHz" onOpenHelp={openHelpGuide} />
              <div className="caa-inline">
                <input
                  type="number"
                  min="0.05"
                  max="2.0"
                  step="0.01"
                  value={config.lossAt1GHz}
                  onChange={(event) => update('lossAt1GHz', clamp(Number(event.target.value) || 0.2, 0.05, 2))}
                />
                <span className="caa-unit">dB/100 ft</span>
              </div>
            </label>
            <label><VariableLink label="Condition" variable="Cable Condition" onOpenHelp={openHelpGuide} />
              <select value={config.cableCondition} onChange={(event) => update('cableCondition', event.target.value)}>
                {Object.keys(CONDITION_FACTORS).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>

              <div className="caa-input-group">
            <h4>Connector (Near)</h4>
            <label><VariableLink label="Type" variable="Connector Type/Gender" onOpenHelp={openHelpGuide} />
              <select value={config.nearConnectorType} onChange={(event) => update('nearConnectorType', event.target.value)}>
                {CONNECTOR_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Gender" variable="Connector Type/Gender" onOpenHelp={openHelpGuide} />
              <select value={config.nearGender} onChange={(event) => update('nearGender', event.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label><VariableLink label="Condition" variable="Connector Condition/Torque" onOpenHelp={openHelpGuide} />
              <select value={config.nearCondition} onChange={(event) => update('nearCondition', event.target.value)}>
                {Object.keys(CONDITION_FACTORS).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Torque" variable="Connector Condition/Torque" onOpenHelp={openHelpGuide} />
              <select value={config.nearTorque} onChange={(event) => update('nearTorque', event.target.value)}>
                {Object.keys(TORQUE_FACTORS).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Adapters" variable="Adapters" onOpenHelp={openHelpGuide} />
              <input
                type="number"
                min="0"
                max="4"
                step="1"
                value={config.nearAdapters}
                onChange={(event) => update('nearAdapters', clamp(Number(event.target.value) || 0, 0, 4))}
              />
            </label>
          </div>

              <div className="caa-input-group">
            <h4>Connector (Far)</h4>
            <label><VariableLink label="Type" variable="Connector Type/Gender" onOpenHelp={openHelpGuide} />
              <select value={config.farConnectorType} onChange={(event) => update('farConnectorType', event.target.value)}>
                {CONNECTOR_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Gender" variable="Connector Type/Gender" onOpenHelp={openHelpGuide} />
              <select value={config.farGender} onChange={(event) => update('farGender', event.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label><VariableLink label="Condition" variable="Connector Condition/Torque" onOpenHelp={openHelpGuide} />
              <select value={config.farCondition} onChange={(event) => update('farCondition', event.target.value)}>
                {Object.keys(CONDITION_FACTORS).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Torque" variable="Connector Condition/Torque" onOpenHelp={openHelpGuide} />
              <select value={config.farTorque} onChange={(event) => update('farTorque', event.target.value)}>
                {Object.keys(TORQUE_FACTORS).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Adapters" variable="Adapters" onOpenHelp={openHelpGuide} />
              <input
                type="number"
                min="0"
                max="4"
                step="1"
                value={config.farAdapters}
                onChange={(event) => update('farAdapters', clamp(Number(event.target.value) || 0, 0, 4))}
              />
            </label>
          </div>

              <div className="caa-input-group">
            <h4>Antenna</h4>
            <label><VariableLink label="Type" variable="Antenna Type/Model" onOpenHelp={openHelpGuide} />
              <select value={config.antennaType} onChange={(event) => {
                const nextType = event.target.value;
                const nextModel = ANTENNA_OPTIONS.find((item) => item.type === nextType) || defaultAntenna;
                update('antennaType', nextType);
                update('antennaModel', nextModel.value);
              }}>
                {[...new Set(ANTENNA_OPTIONS.map((item) => item.type))].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Model" variable="Antenna Type/Model" onOpenHelp={openHelpGuide} />
              <select value={config.antennaModel} onChange={(event) => update('antennaModel', event.target.value)}>
                {antennaForType.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Match Quality" variable="Match Quality" onOpenHelp={openHelpGuide} />
              <select value={config.matchQuality} onChange={(event) => update('matchQuality', event.target.value)}>
                {Object.keys(MATCH_QUALITY_FACTORS).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <label><VariableLink label="Environment" variable="Environment" onOpenHelp={openHelpGuide} />
              <select value={config.environment} onChange={(event) => update('environment', event.target.value)}>
                {Object.keys(ENVIRONMENT_FACTORS).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
              </div>
            </>
          ) : null}

          {isMeasureView ? (
            <>
              {sectionTitle('Measurement Setup', 1)}
              <div className="caa-input-group">
                <h4>Frequency Sweep</h4>
                <label><VariableLink label="Start Frequency" variable="Start/Stop Frequency" onOpenHelp={openHelpGuide} />
                  <div className="caa-inline">
                    <input type="number" min="100" max="10000" step="1" value={config.startMHz} onChange={(event) => update('startMHz', clamp(Number(event.target.value) || 100, 100, 10000))} />
                    <span className="caa-unit">MHz</span>
                  </div>
                </label>
                <label><VariableLink label="Stop Frequency" variable="Start/Stop Frequency" onOpenHelp={openHelpGuide} />
                  <div className="caa-inline">
                    <input type="number" min="110" max="10000" step="1" value={config.stopMHz} onChange={(event) => update('stopMHz', clamp(Number(event.target.value) || 200, 110, 10000))} />
                    <span className="caa-unit">MHz</span>
                  </div>
                </label>
                <label><VariableLink label="Points" variable="Points" onOpenHelp={openHelpGuide} />
                  <input type="number" min="81" max="401" step="20" value={config.points} onChange={(event) => update('points', clamp(Number(event.target.value) || 161, 81, 401))} />
                </label>
                <label><VariableLink label="Sweep Type" variable="Sweep Type" onOpenHelp={openHelpGuide} />
                  <select value={sweepType} onChange={(event) => {
                    setSweepType(event.target.value);
                    showToast(`Sweep type set to ${event.target.value}`);
                  }}>
                    <option value="Linear">Linear</option>
                    <option value="Log">Log</option>
                  </select>
                </label>
                <label><VariableLink label="Averaging" variable="Sweep Averaging" onOpenHelp={openHelpGuide} />
                  <input type="number" min="1" max="8" step="1" value={sweepAveraging} onChange={(event) => setSweepAveraging(clamp(Number(event.target.value) || 1, 1, 8))} />
                </label>
                <label><VariableLink label="Display Format" variable="Display Format" onOpenHelp={openHelpGuide} />
                  <select value={displayFormat} onChange={(event) => {
                    const value = event.target.value;
                    setDisplayFormat(value);
                    if (value === 'VSWR') {
                      setActiveTab('vswr');
                    } else if (value === 'Linear Mag') {
                      setActiveTab('cableLoss');
                    } else {
                      setActiveTab('returnLoss');
                    }
                  }}>
                    <option value="Log Mag">Log Mag</option>
                    <option value="Linear Mag">Linear Mag</option>
                    <option value="VSWR">VSWR</option>
                  </select>
                </label>
              </div>

              <div className="caa-input-group">
                <h4>Calibration</h4>
                <label><VariableLink label="Calibration Kit" variable="Calibration" onOpenHelp={openHelpGuide} />
                  <select value={config.calibration} onChange={(event) => update('calibration', event.target.value)}>
                    <option value="1-Port (Open/Short/Load)">1-Port (Open/Short/Load)</option>
                    <option value="1-Port (Open/Load)">1-Port (Open/Load)</option>
                    <option value="Factory Cal">Factory Cal</option>
                  </select>
                </label>
                <label><VariableLink label="Calibration Status" variable="Calibration Status" onOpenHelp={openHelpGuide} />
                  <input type="text" value="Calibrated" readOnly />
                </label>
                <label>Cal Date / Time
                  <input type="text" value={new Date().toLocaleString()} readOnly />
                </label>
                <button className="caa-run-btn caa-run-btn--secondary" type="button" onClick={() => {
                  setSeed((value) => value + 1);
                  showToast('Calibration refreshed');
                }}>
                  Recalibrate
                </button>
              </div>

              <div className="caa-input-group">
                <h4>Trace Settings</h4>
                <div className="caa-measure-trace-list">
                  {measureTraceRows.map((trace) => (
                    <button
                      key={trace.id}
                      type="button"
                      className={activeTab === trace.id ? 'caa-measure-trace-btn caa-measure-trace-btn--active' : 'caa-measure-trace-btn'}
                      onClick={() => setActiveTab(trace.id)}
                    >
                      <span>{trace.label}</span>
                      <span>{activeTab === trace.id ? 'ON' : 'OFF'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="caa-input-group">
                <h4>Scenario Degradation</h4>
                <label><VariableLink label="Scenario" variable="Scenario + Severity" onOpenHelp={openHelpGuide} />
                  <select value={selectedScenario} onChange={(event) => setSelectedScenario(event.target.value)}>
                    {scenarioEntries.map(([key, scenario]) => (
                      <option key={`measure-scenario-${key}`} value={key}>{scenario.label}</option>
                    ))}
                  </select>
                </label>
                <label><VariableLink label={`Severity (${severity}%)`} variable="Scenario + Severity" onOpenHelp={openHelpGuide} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={severity}
                    onChange={(event) => setSeverity(Number(event.target.value))}
                  />
                </label>
                <button className="caa-run-btn caa-run-btn--secondary" type="button" onClick={applyScenario}>
                  Apply Degradation
                </button>
              </div>
            </>
          ) : null}

          {isDiagnoseView ? (
            <>
              {sectionTitle('Diagnosis Controls', 1)}
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Scenario Selector</h3>
                <div className="caa-scenario-grid">
                  {scenarioEntries.map(([key, scenario]) => (
                    <button
                      key={`diag-left-${key}`}
                      type="button"
                      className={selectedScenario === key ? 'caa-scenario-btn caa-scenario-btn--active' : 'caa-scenario-btn'}
                      onClick={() => setSelectedScenario(key)}
                    >
                      <span className="caa-scenario-btn__dot" style={{ background: scenario.color }} />
                      {scenario.label}
                    </button>
                  ))}
                </div>
                <label className="caa-slider-label">
                  <VariableLink label="Severity / Degradation Level" variable="Scenario + Severity" onOpenHelp={openHelpGuide} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={severity}
                    onChange={(event) => setSeverity(Number(event.target.value))}
                  />
                  <span>{severity}%</span>
                </label>
                <button className="caa-run-btn caa-run-btn--secondary" type="button" onClick={applyScenario}>
                  Apply Scenario
                </button>
              </div>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Diagnosis Workflow</h3>
                <div className="caa-guide-table">
                  {diagnoseChecklist.map((item) => (
                    <article key={`diag-check-${item}`} className="caa-guide-row">
                      <strong>Action</strong>
                      <small>{item}</small>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {isLearnView ? (
            <>
              {sectionTitle('Learning Tracks', 1)}
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Topic Navigator</h3>
                <div className="caa-issue-list">
                  {LEARN_TOPIC_CATALOG.map((topic) => (
                    <button
                      key={`learn-topic-${topic.id}`}
                      type="button"
                      className={learnTopicId === topic.id ? 'caa-issue-list__item caa-issue-list__item--active' : 'caa-issue-list__item'}
                      onClick={() => setLearnTopicId(topic.id)}
                    >
                      <div>
                        <strong>{topic.title}</strong>
                        <span>{topic.practice}</span>
                      </div>
                      <em className="caa-severity-badge caa-severity-badge--low">Topic</em>
                    </button>
                  ))}
                </div>
              </div>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Lab Profile</h3>
                <div className="caa-guide-table">
                  <article className="caa-guide-row">
                    <strong>Mismatch Drive</strong>
                    <small>{learnMismatch}%</small>
                  </article>
                  <article className="caa-guide-row">
                    <strong>Cable Stress</strong>
                    <small>{learnCableStress}%</small>
                  </article>
                  <article className="caa-guide-row">
                    <strong>Reflection Mode</strong>
                    <small>{learnReflectionMode}</small>
                  </article>
                </div>
                <button
                  className="caa-run-btn caa-run-btn--secondary"
                  type="button"
                  onClick={() => {
                    setLearnMismatch(30);
                    setLearnCableStress(25);
                    setLearnReflectionMode('connector');
                    setLearnReflectionSeverity(35);
                    setLearnChartMode('returnLoss');
                    showToast('Learn lab controls reset');
                  }}
                >
                  Reset Learn Lab
                </button>
              </div>
            </>
          ) : null}
        </aside>

        <main className="caa-center">
          {isMeasureView ? (
            <>
              <section className="caa-card">
                {sectionTitle('Live Measurement', 2)}
                <div className="caa-tabs">
                  {measureModeTabs.map((tab) => (
                    <button
                      key={`measure-mode-${tab.id}`}
                      type="button"
                      className={activeTab === tab.id ? 'caa-tabs__btn caa-tabs__btn--active' : 'caa-tabs__btn'}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <p className="caa-field-note caa-measure-trace-title">
                  {measureTraceRows.find((item) => item.id === activeTab)?.label || 'S11 (Return Loss)'}
                </p>
                <p className="caa-field-note">Click the chart to place marker <strong>{activeMarker}</strong>.</p>
                {activeTab === 'smithChart' ? (
                  <SmithChart
                    points={smithPoints}
                    markers={chartMarkers}
                    activeMarkerLabel={activeMarker}
                    onPlaceMarker={placeMarkerOnSmith}
                  />
                ) : (
                  <MiniChart
                    xValues={chartForDisplay.xValues}
                    yValues={chartForDisplay.yValues}
                    yMin={chartForDisplay.yMin}
                    yMax={chartForDisplay.yMax}
                    color={chartForDisplay.color}
                    area={chartForDisplay.area}
                    xLabel={chartForDisplay.xLabel}
                    yLabel={chartForDisplay.yLabel}
                    formatX={chartForDisplay.formatX}
                    formatY={chartForDisplay.formatY}
                    markers={chartMarkers}
                    activeMarkerLabel={activeMarker}
                    onPlaceMarker={placeMarkerAtX}
                  />
                )}
              </section>

              <section className="caa-card">
                {sectionTitle('Measurement Summary', 3)}
                <div className="caa-results-grid caa-results-grid--measure">
                  {measureSummaryRows.map((item) => (
                    <div key={`measure-summary-${item.label}`}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {isDiagnoseView ? (
            <section className="caa-card">
              {sectionTitle('Diagnostic Overview', 2)}
              <div className="caa-diagnose-overview">
                <article className="caa-diagnose-score">
                  <VariableLink label="System Health" variable="System Health Score" onOpenHelp={openHelpGuide} />
                  <strong>{diagnoseAnalysis.healthScore}</strong>
                  <em>{diagnoseAnalysis.healthBand}</em>
                </article>
                <article className="caa-diagnose-score">
                  <VariableLink label="Applied Scenario" variable="Scenario + Severity" onOpenHelp={openHelpGuide} />
                  <strong>{SCENARIOS[appliedScenario].label}</strong>
                  <em>Severity {severity}%</em>
                </article>
                <article className="caa-diagnose-score">
                  <VariableLink label="Likely Fault Location" variable="Fault Location Estimate" onOpenHelp={openHelpGuide} />
                  <strong>{diagnoseAnalysis.inferredFaultFt ? formatDistance(diagnoseAnalysis.inferredFaultFt) : 'Not localized'}</strong>
                  <em>{diagnoseAnalysis.dtfHotspots[0] ? `${diagnoseAnalysis.dtfHotspots[0].value.toFixed(1)} dB hotspot` : 'No DTF hotspot'}</em>
                </article>
              </div>
              <div className="caa-results-grid">
                <div>
                  <VariableLink label="Return Loss (Min)" variable="Return Loss (Min)" onOpenHelp={openHelpGuide} />
                  <strong>{diagnoseAnalysis.metrics.returnLossMin.toFixed(1)} dB</strong>
                </div>
                <div>
                  <VariableLink label="VSWR (Max)" variable="VSWR (Max)" onOpenHelp={openHelpGuide} />
                  <strong>{diagnoseAnalysis.metrics.vswrMax.toFixed(2)}:1</strong>
                </div>
                <div>
                  <VariableLink label="Cable Loss @ 1 GHz" variable="Loss @ 1 GHz" onOpenHelp={openHelpGuide} />
                  <strong>{diagnoseAnalysis.metrics.cableLossAt1GHz.toFixed(2)} dB</strong>
                </div>
                <div>
                  <VariableLink label="DTF Peak" variable="DTF Peak" onOpenHelp={openHelpGuide} />
                  <strong>{diagnoseAnalysis.metrics.dtfPeak.toFixed(1)} dB</strong>
                </div>
              </div>
            </section>
          ) : null}

          {isBuildView ? (
            <section className="caa-card">
              {sectionTitle('System Overview', 2)}
              <div className="caa-overview">
                <div className="caa-overview__node">
                  <div className="caa-overview__icon">Analyzer</div>
                  <small>Port 1</small>
                </div>
                <div className="caa-overview__link">Test Port N-Type</div>
                <div className="caa-overview__node">
                  <div className="caa-overview__icon">{CABLE_OPTIONS.find((item) => item.value === config.cableType)?.label}</div>
                  <small>{lengthDisplay.toFixed(1)} {config.units}</small>
                </div>
                <div className="caa-overview__link">Far Connector</div>
                <div className="caa-overview__node">
                  <div className="caa-overview__icon">{ANTENNA_OPTIONS.find((item) => item.value === config.antennaModel)?.label}</div>
                  <small>Antenna</small>
                </div>
              </div>
            </section>
          ) : null}

          {isBuildView ? (
            <section className="caa-card caa-card--setup">
              {sectionTitle('Analyzer Setup', 3)}
              <div className="caa-setup-grid">
                <label><VariableLink label="Start Frequency" variable="Start/Stop Frequency" onOpenHelp={openHelpGuide} />
                  <div className="caa-inline">
                    <input type="number" min="100" max="10000" step="1" value={config.startMHz} onChange={(event) => update('startMHz', clamp(Number(event.target.value) || 100, 100, 10000))} />
                    <span className="caa-unit">MHz</span>
                  </div>
                </label>
                <label><VariableLink label="Stop Frequency" variable="Start/Stop Frequency" onOpenHelp={openHelpGuide} />
                  <div className="caa-inline">
                    <input type="number" min="110" max="10000" step="1" value={config.stopMHz} onChange={(event) => update('stopMHz', clamp(Number(event.target.value) || 200, 110, 10000))} />
                    <span className="caa-unit">MHz</span>
                  </div>
                </label>
                <label><VariableLink label="Points" variable="Points" onOpenHelp={openHelpGuide} />
                  <input type="number" min="81" max="401" step="20" value={config.points} onChange={(event) => update('points', clamp(Number(event.target.value) || 161, 81, 401))} />
                </label>
                <p className="caa-field-note caa-field-note--setup">If unknown: <strong>161</strong> points is a strong default for general troubleshooting.</p>
                <label><VariableLink label="Calibration" variable="Calibration" onOpenHelp={openHelpGuide} />
                  <select value={config.calibration} onChange={(event) => update('calibration', event.target.value)}>
                    <option value="1-Port (Open/Short/Load)">1-Port (Open/Short/Load)</option>
                    <option value="1-Port (Open/Load)">1-Port (Open/Load)</option>
                    <option value="Factory Cal">Factory Cal</option>
                  </select>
                </label>
                <label><VariableLink label="DTF Range" variable="DTF Range" onOpenHelp={openHelpGuide} />
                  <div className="caa-inline">
                    <input
                      type="number"
                      min="20"
                      max="1200"
                      step="1"
                      value={dtfRangeDisplay.toFixed(1)}
                      onChange={(event) => {
                        const numeric = Number(event.target.value) || 0;
                        const asFt = config.units === 'ft' ? numeric : numeric * FT_PER_M;
                        update('dtfRangeFt', clamp(asFt, 20, 1200));
                      }}
                    />
                    <span className="caa-unit">{config.units}</span>
                  </div>
                </label>
                <label><VariableLink label="DTF Resolution" variable="DTF Resolution" onOpenHelp={openHelpGuide} />
                  <select value={config.dtfResolutionFt} onChange={(event) => update('dtfResolutionFt', Number(event.target.value))}>
                    <option value="0.5">Very High</option>
                    <option value="1">High</option>
                    <option value="2">Medium</option>
                    <option value="4">Low</option>
                  </select>
                </label>
                <label>Units
                  <div className="caa-toggle">
                    <button
                      className={config.units === 'ft' ? 'is-active' : ''}
                      type="button"
                      onClick={() => update('units', 'ft')}
                    >
                      ft
                    </button>
                    <button
                      className={config.units === 'm' ? 'is-active' : ''}
                      type="button"
                      onClick={() => update('units', 'm')}
                    >
                      m
                    </button>
                  </div>
                </label>
              </div>
              <button className="caa-run-btn" type="button" onClick={() => setSeed((value) => value + 1)}>
                Run Simulation
              </button>
            </section>
          ) : null}

          {(isBuildView || isDiagnoseView) ? (
            <section className="caa-card">
              {sectionTitle(isDiagnoseView ? 'Diagnostic Evidence Traces' : 'Measurement Results', isBuildView ? 4 : 3)}
              <div className="caa-tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={activeTab === tab.id ? 'caa-tabs__btn caa-tabs__btn--active' : 'caa-tabs__btn'}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <MiniChart
                xValues={currentChart.xValues}
                yValues={currentChart.yValues}
                yMin={currentChart.yMin}
                yMax={currentChart.yMax}
                color={currentChart.color}
                area={currentChart.area}
                xLabel={currentChart.xLabel}
                yLabel={currentChart.yLabel}
                formatX={currentChart.formatX}
                formatY={currentChart.formatY}
              />
              <div className="caa-results-grid">
                <div>
                  <span>Min Return Loss</span>
                  <strong>{toDb(primaryResults.summary.returnLossMin)}</strong>
                </div>
                <div>
                  <span>Max VSWR</span>
                  <strong>{primaryResults.summary.vswrMax.toFixed(2)}:1</strong>
                </div>
                <div>
                  <span>Cable Loss @ 1 GHz</span>
                  <strong>{toDb(primaryResults.summary.cableLossAt1GHz)}</strong>
                </div>
                <div>
                  <span>Peak DTF Reflection</span>
                  <strong>{toDb(primaryResults.summary.dtfPeak)}</strong>
                </div>
              </div>
            </section>
          ) : null}

          {isBuildView ? (
            <section className="caa-card">
              {sectionTitle('Scenario / Fault Simulator', 5)}
              <div className="caa-scenario-grid">
                {scenarioEntries.map(([key, scenario]) => (
                  <button
                    key={key}
                    type="button"
                    className={selectedScenario === key ? 'caa-scenario-btn caa-scenario-btn--active' : 'caa-scenario-btn'}
                    onClick={() => setSelectedScenario(key)}
                  >
                    <span className="caa-scenario-btn__dot" style={{ background: scenario.color }} />
                    {scenario.label}
                  </button>
                ))}
              </div>
              <label className="caa-slider-label">
                <VariableLink label="Severity / Degradation Level" variable="Scenario + Severity" onOpenHelp={openHelpGuide} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={severity}
                  onChange={(event) => setSeverity(Number(event.target.value))}
                />
                <span>{severity}%</span>
              </label>
              <button className="caa-run-btn caa-run-btn--secondary" type="button" onClick={applyScenario}>
                Apply Scenario
              </button>
            </section>
          ) : null}

          {isDiagnoseView ? (
            <>
              <section className="caa-card">
                {sectionTitle('Detected Issues', 4)}
                <div className="caa-issue-list">
                  {diagnoseAnalysis.issues.map((issue) => (
                    <button
                      key={issue.id}
                      type="button"
                      className={selectedDiagnosisIssue?.id === issue.id ? 'caa-issue-list__item caa-issue-list__item--active' : 'caa-issue-list__item'}
                      onClick={() => setSelectedDiagnosisIssueId(issue.id)}
                    >
                      <div>
                        <strong>{issue.title}</strong>
                        <span>{issue.explanation}</span>
                      </div>
                      <em className={`caa-severity-badge caa-severity-badge--${issue.severity}`}>{issue.severity}</em>
                    </button>
                  ))}
                </div>
              </section>

              <section className="caa-card">
                {sectionTitle('Issue Drill-Down', 5)}
                {selectedDiagnosisIssue ? (
                  <div className="caa-guide-table">
                    <article className="caa-guide-row">
                      <strong>{selectedDiagnosisIssue.title}</strong>
                      <span>{selectedDiagnosisIssue.drilldown.whyItHappens}</span>
                    </article>
                    <article className="caa-guide-row">
                      <strong>Validation Steps</strong>
                      {selectedDiagnosisIssue.drilldown.validationSteps.map((step) => (
                        <small key={`${selectedDiagnosisIssue.id}-${step}`}>{step}</small>
                      ))}
                    </article>
                    <article className="caa-guide-row">
                      <strong>Recommended Actions</strong>
                      {selectedDiagnosisIssue.recommendations.map((action) => (
                        <small key={`${selectedDiagnosisIssue.id}-${action}`}>{action}</small>
                      ))}
                    </article>
                  </div>
                ) : (
                  <p className="caa-field-note">No issues detected in this diagnostic pass.</p>
                )}
              </section>

              <section className="caa-card">
                {sectionTitle('Action Plan', 6)}
                <div className="caa-guide-table">
                  {diagnoseAnalysis.recommendations.map((recommendation) => (
                    <article key={recommendation.id} className="caa-guide-row">
                      <strong>Priority {recommendation.priority}</strong>
                      <small>{recommendation.text}</small>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {isLearnView ? (
            <>
              <section className="caa-card">
                {sectionTitle('RF Learning Module', 2)}
                <div className="caa-guide-table">
                  <article className="caa-guide-row">
                    <strong>{learnTopic.title}</strong>
                    <span>{learnTopic.theory}</span>
                    <small><strong>Theory to practice:</strong> {learnTopic.practice}</small>
                    <small><strong>Real-world anchor:</strong> {learnTopic.example}</small>
                  </article>
                </div>
              </section>

              <section className="caa-card">
                {sectionTitle('Interactive Controls', 3)}
                <div className="caa-setup-grid caa-setup-grid--learn">
                  <label>Mismatch Drive ({learnMismatch}%)
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={learnMismatch}
                      onChange={(event) => setLearnMismatch(Number(event.target.value))}
                    />
                  </label>
                  <label>Cable Stress ({learnCableStress}%)
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={learnCableStress}
                      onChange={(event) => setLearnCableStress(Number(event.target.value))}
                    />
                  </label>
                  <label>Reflection Type
                    <select value={learnReflectionMode} onChange={(event) => setLearnReflectionMode(event.target.value)}>
                      <option value="connector">Connector Discontinuity</option>
                      <option value="open">Open-like Fault</option>
                      <option value="short">Short-like Fault</option>
                      <option value="water">Water Ingress</option>
                    </select>
                  </label>
                  <label>Reflection Severity ({learnReflectionSeverity}%)
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={learnReflectionSeverity}
                      onChange={(event) => setLearnReflectionSeverity(Number(event.target.value))}
                    />
                  </label>
                  <label>Comparison View
                    <div className="caa-tabs caa-tabs--compact">
                      <button
                        type="button"
                        className={learnChartMode === 'returnLoss' ? 'caa-tabs__btn caa-tabs__btn--active' : 'caa-tabs__btn'}
                        onClick={() => setLearnChartMode('returnLoss')}
                      >
                        Return Loss
                      </button>
                      <button
                        type="button"
                        className={learnChartMode === 'vswr' ? 'caa-tabs__btn caa-tabs__btn--active' : 'caa-tabs__btn'}
                        onClick={() => setLearnChartMode('vswr')}
                      >
                        VSWR
                      </button>
                    </div>
                  </label>
                  <label>Applied Learn Scenario
                    <input type="text" value={SCENARIOS[learnScenarioKey].label} readOnly />
                  </label>
                </div>
              </section>

              <section className="caa-card">
                {sectionTitle('Theory to Practice Diagram', 4)}
                <div className="caa-learn-flow">
                  <div className="caa-learn-flow__bar">
                    <span>Forward Energy</span>
                    <em>{learnForwardPct.toFixed(1)}%</em>
                    <div><i style={{ width: `${learnForwardPct}%` }} /></div>
                  </div>
                  <div className="caa-learn-flow__bar">
                    <span>Cable Loss Energy</span>
                    <em>{learnLossPct.toFixed(1)}%</em>
                    <div><i style={{ width: `${learnLossPct}%` }} /></div>
                  </div>
                  <div className="caa-learn-flow__bar">
                    <span>Reflected Energy</span>
                    <em>{learnReflectedPct.toFixed(1)}%</em>
                    <div><i style={{ width: `${learnReflectedPct}%` }} /></div>
                  </div>
                </div>
                <p className="caa-footnote">
                  As mismatch/reflections increase, reflected energy rises, VSWR increases, and return loss falls. Cable stress raises insertion loss and can hide weaker reflections.
                </p>
              </section>

              <section className="caa-card">
                {sectionTitle('Comparison Charts', 5)}
                <div className="caa-learn-charts">
                  <article>
                    <h4>Baseline (Build Good System)</h4>
                    <MiniChart
                      xValues={baselineResults.freqs}
                      yValues={learnChart.baselineY}
                      yMin={learnChart.yMin}
                      yMax={learnChart.yMax}
                      color="#4ab3ff"
                      area={learnChartMode === 'returnLoss'}
                      xLabel="Frequency (MHz)"
                      yLabel={learnChart.yLabel}
                      formatX={(value) => value.toFixed(0)}
                      formatY={learnChart.formatY}
                    />
                  </article>
                  <article>
                    <h4>Learning Lab Response ({learnChart.title})</h4>
                    <MiniChart
                      xValues={learnSimResults.freqs}
                      yValues={learnChart.labY}
                      yMin={learnChart.yMin}
                      yMax={learnChart.yMax}
                      color={learnChart.color}
                      area={learnChartMode === 'returnLoss'}
                      xLabel="Frequency (MHz)"
                      yLabel={learnChart.yLabel}
                      formatX={(value) => value.toFixed(0)}
                      formatY={learnChart.formatY}
                    />
                  </article>
                </div>
                <div className="caa-preview-table">
                  <div>
                    <span>Metric</span>
                    <span>Baseline</span>
                    <span>Learning Lab (Delta)</span>
                  </div>
                  {learnComparisonRows.map((row) => (
                    <div key={`learn-compare-${row.metric}`}>
                      <span>{row.metric}</span>
                      <span>{row.baseline}</span>
                      <span>{row.lab} ({row.delta})</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </main>

        <aside className="caa-panel caa-panel--right">
          {isBuildView ? (
            <div className="caa-card caa-card--side">
              <h3 className="caa-side-title">Status Summary</h3>
              <div className="caa-status-row">
                <span>Overall Result</span>
                <strong className={overallBadgeClass}>
                  {primaryResults.summary.overallPass ? 'PASS' : 'CHECK'}
                </strong>
              </div>
              <div className="caa-status-row">
                <span>VSWR (Max)</span>
                <strong>{primaryResults.summary.vswrMax.toFixed(2)}:1</strong>
              </div>
              <div className="caa-status-row">
                <span>Return Loss (Min)</span>
                <strong>{toDb(primaryResults.summary.returnLossMin)}</strong>
              </div>
              <div className="caa-status-row">
                <span>Single Port Loss (S11)</span>
                <strong>{toDb(primaryResults.summary.singlePortLoss)}</strong>
              </div>
              <div className="caa-status-row">
                <span>Cable Loss @ 1 GHz</span>
                <strong>{toDb(primaryResults.summary.cableLossAt1GHz)}</strong>
              </div>
              <div className="caa-status-row">
                <span>Reflected Power (Max)</span>
                <strong>{toPct(primaryResults.summary.reflectedPowerMax)}</strong>
              </div>
              <div className="caa-status-row">
                <span>Distance to Fault</span>
                <strong>{displayedFaultDistance}</strong>
              </div>
            </div>
          ) : null}

          {isMeasureView ? (
            <>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Measurement Controls</h3>
                <button className="caa-run-btn" type="button" onClick={() => startSweep()}>
                  Start Sweep
                </button>
                <button className="caa-run-btn caa-run-btn--secondary" type="button" onClick={() => startSweep({ single: true })}>
                  Single Sweep
                </button>
                <div className="caa-measure-progress">
                  <div className="caa-measure-progress__header">
                    <VariableLink label="Sweep Progress" variable="Sweep Progress" onOpenHelp={openHelpGuide} />
                    <strong>{sweepProgress.toFixed(0)}%</strong>
                  </div>
                  <div className="caa-measure-progress__track">
                    <span style={{ width: `${sweepProgress}%` }} />
                  </div>
                </div>
              </div>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Marker Table</h3>
                <div className="caa-tabs caa-tabs--compact">
                  {['M1', 'M2', 'M3'].map((markerLabel) => (
                    <button
                      key={`marker-select-${markerLabel}`}
                      type="button"
                      className={activeMarker === markerLabel ? 'caa-tabs__btn caa-tabs__btn--active' : 'caa-tabs__btn'}
                      onClick={() => setActiveMarker(markerLabel)}
                    >
                      {markerLabel}
                    </button>
                  ))}
                </div>
                <div className="caa-marker-table">
                  <div className="caa-marker-table__head">
                    <span>Marker</span>
                    <span>Frequency</span>
                    <span>Value</span>
                  </div>
                  {markerRows.map((row) => (
                    <div key={`marker-${row.marker}`} className="caa-marker-table__row">
                      <span>{row.marker}</span>
                      <span>{row.axisValue}</span>
                      <span>{row.markerValue}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="caa-card caa-card--side">
                <div className="caa-tabs caa-tabs--compact">
                  <button className="caa-tabs__btn caa-tabs__btn--active" type="button" onClick={() => exportMeasure('csv')}>
                    Export CSV
                  </button>
                  <button className="caa-tabs__btn" type="button" onClick={() => exportMeasure('json')}>
                    Export JSON
                  </button>
                </div>
                <button className="caa-run-btn caa-run-btn--secondary caa-export-btn" type="button" onClick={() => showToast('Streaming export is not implemented yet.')}>
                  Export Stream
                </button>
              </div>
            </>
          ) : null}

          {isDiagnoseView ? (
            <>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Health Breakdown</h3>
                <div className="caa-health-bar">
                  <span style={{ width: `${diagnoseAnalysis.healthScore}%` }} />
                </div>
                <p className="caa-footnote">
                  Score <strong>{diagnoseAnalysis.healthScore}</strong> / 100 ({diagnoseAnalysis.healthBand})
                </p>
                <div className="caa-status-row">
                  <VariableLink label="Open Issues" variable="Open Issues" onOpenHelp={openHelpGuide} />
                  <strong>{diagnoseAnalysis.issues.length}</strong>
                </div>
                <div className="caa-status-row">
                  <VariableLink label="Critical / High" variable="Critical / High Issues" onOpenHelp={openHelpGuide} />
                  <strong>
                    {diagnoseAnalysis.issues.filter((issue) => issue.severity === 'critical' || issue.severity === 'high').length}
                  </strong>
                </div>
              </div>

              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Fault Localization</h3>
                <div className="caa-guide-table">
                  <article className="caa-guide-row">
                    <strong><VariableLink label="Estimated Fault Distance" variable="Fault Location Estimate" onOpenHelp={openHelpGuide} /></strong>
                    <small>{diagnoseAnalysis.inferredFaultFt ? formatDistance(diagnoseAnalysis.inferredFaultFt) : 'No dominant fault detected'}</small>
                  </article>
                  <article className="caa-guide-row">
                    <strong><VariableLink label="Top DTF Hotspots" variable="DTF Peak" onOpenHelp={openHelpGuide} /></strong>
                    {diagnoseAnalysis.dtfHotspots.map((hotspot, index) => (
                      <small key={`hotspot-${index + 1}`}>
                        #{index + 1}: {hotspot.value.toFixed(1)} dB at {formatDistance(hotspot.distanceFt)}
                      </small>
                    ))}
                  </article>
                </div>
              </div>

              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Top Recommendations</h3>
                <ul className="caa-insights">
                  {diagnoseAnalysis.recommendations.slice(0, 4).map((recommendation) => (
                    <li key={`diag-rec-${recommendation.id}`}>{recommendation.text}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {isBuildView ? (
            <>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Scenario Effects (Preview)</h3>
                <div className="caa-preview-table">
                  <div>
                    <span>Metric</span>
                    <span>Good</span>
                    <span>Scenario</span>
                  </div>
                  <div>
                    <span>VSWR (max)</span>
                    <span>{baselineResults.summary.vswrMax.toFixed(2)}:1</span>
                    <span>{previewResults.summary.vswrMax.toFixed(2)}:1</span>
                  </div>
                  <div>
                    <span>Return Loss (min)</span>
                    <span>{baselineResults.summary.returnLossMin.toFixed(1)} dB</span>
                    <span>{previewResults.summary.returnLossMin.toFixed(1)} dB</span>
                  </div>
                  <div>
                    <span>Cable Loss @ 1 GHz</span>
                    <span>{baselineResults.summary.cableLossAt1GHz.toFixed(2)} dB</span>
                    <span>{previewResults.summary.cableLossAt1GHz.toFixed(2)} dB</span>
                  </div>
                  <div>
                    <span>Reflected Power (max)</span>
                    <span>{baselineResults.summary.reflectedPowerMax.toFixed(1)} %</span>
                    <span>{previewResults.summary.reflectedPowerMax.toFixed(1)} %</span>
                  </div>
                </div>
              </div>

              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Help / Insights</h3>
                <ul className="caa-insights">
                  {primaryResults.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
                <p className="caa-footnote">
                  Applied scenario: <strong>{SCENARIOS[appliedScenario].label}</strong>. Selected scenario: <strong>{SCENARIOS[selectedScenario].label}</strong>.
                </p>
              </div>
            </>
          ) : null}

          {isLearnView ? (
            <>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Knowledge Check</h3>
                <div className="caa-guide-table">
                  {LEARN_QUIZ_ITEMS.map((quiz) => (
                    <article key={quiz.id} className="caa-guide-row">
                      <strong>{quiz.prompt}</strong>
                      <div className="caa-tabs caa-tabs--compact">
                        {quiz.options.map((option, optionIndex) => (
                          <button
                            key={`${quiz.id}-${option}`}
                            type="button"
                            className={learnQuizAnswers[quiz.id] === optionIndex ? 'caa-tabs__btn caa-tabs__btn--active' : 'caa-tabs__btn'}
                            onClick={() => setLearnQuizAnswers((previous) => ({ ...previous, [quiz.id]: optionIndex }))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {learnQuizAnswers[quiz.id] !== undefined ? (
                        <small>
                          {learnQuizAnswers[quiz.id] === quiz.correctIndex ? 'Correct: ' : 'Review: '}
                          {quiz.explanation}
                        </small>
                      ) : null}
                    </article>
                  ))}
                </div>
                <p className="caa-footnote">Quiz score: <strong>{learnQuizScore}</strong> / {LEARN_QUIZ_ITEMS.length}</p>
              </div>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Learning Notes</h3>
                <label className="caa-label-block">
                  Capture what changed and why:
                  <textarea
                    className="caa-textarea"
                    value={learnNotes}
                    onChange={(event) => setLearnNotes(event.target.value)}
                    placeholder="Example: Increasing mismatch to 70% raised VSWR by 0.9 and dropped minimum return loss by 5 dB."
                  />
                </label>
              </div>
              <div className="caa-card caa-card--side">
                <h3 className="caa-side-title">Real-World Examples</h3>
                <div className="caa-guide-table">
                  {learnRealWorldExamples.map((example) => (
                    <article key={example} className="caa-guide-row">
                      <strong>Case Study</strong>
                      <small>{example}</small>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : null}

        </aside>
      </div>

      {toastMessage ? (
        <div className="caa-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}

      {showHelpGuide ? (
        <div
          className="caa-help-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="caa-help-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowHelpGuide(false);
            }
          }}
        >
          <div className="caa-help-modal__panel">
            <div className="caa-help-modal__header">
              <h2 id="caa-help-title">Cable and Antenna Analyzer Guide</h2>
              <button className="caa-help-modal__close" type="button" onClick={() => setShowHelpGuide(false)}>
                Close
              </button>
            </div>
            <div className="caa-help-modal__body">
              <section>
                <h3>How This Tool Works</h3>
                <ol>
                  {WORKFLOW_GUIDE.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>

              <section>
                <h3>Workspace Tabs: Build, Measure, Diagnose, Learn</h3>
                <div className="caa-help-guide-table">
                  {TAB_HELP_GUIDE.map((item) => (
                    <article key={item.tab} className="caa-help-guide-row">
                      <h4>{item.tab}</h4>
                      <p><strong>Purpose:</strong> {item.purpose}</p>
                      <p><strong>What to do:</strong></p>
                      <ul>
                        {item.actions.map((action) => (
                          <li key={`${item.tab}-${action}`}>{action}</li>
                        ))}
                      </ul>
                      <p><strong>You get:</strong> {item.outputs}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h3>Status Summary Logic</h3>
                <p>
                  The tool reports <strong>PASS</strong> only when all thresholds are met inside the antenna operating band.
                  If one or more thresholds fail, status changes to <strong>CHECK</strong>.
                </p>
                <ul>
                  {PASS_RULES.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>Variables, Meanings, and Defaults</h3>
                <p>
                  These shared variables drive the Build model and feed the measurement, diagnostics, and learning views.
                </p>
                <button
                  className="caa-defaults-btn caa-defaults-btn--inline"
                  type="button"
                  onClick={() => applyRecommendedDefaults({ closeHelp: true })}
                >
                  Apply Recommended Defaults
                </button>
                <div className="caa-help-guide-table">
                  {VARIABLE_GUIDE.map((item) => (
                    <article key={item.variable} className="caa-help-guide-row">
                      <h4>{item.variable}</h4>
                      <p>{item.meaning}</p>
                      <p><strong>Good default:</strong> {item.defaultValue}</p>
                      <p><strong>If unsure:</strong> {item.note}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
