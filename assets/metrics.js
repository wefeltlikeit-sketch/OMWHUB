(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.OMWMetrics = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const round = (value, digits = 0) => {
    const factor = 10 ** digits;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  };

  function targetPlan(input) {
    const currentDenominator = Math.max(1, Number(input.currentDenominator));
    const currentNumerator = clamp(Number(input.currentNumerator), 0, currentDenominator);
    const projectedDenominator = Math.max(1, Math.round(currentDenominator * (1 + Number(input.denominatorChangePct) / 100)));
    const naturalClosures = Math.max(0, Number(input.naturalClosures));
    const targetRate = clamp(Number(input.targetRate), 0, 100);
    const bufferPct = Math.max(0, Number(input.bufferPct));
    const monthsRemaining = Math.max(1, Number(input.monthsRemaining));
    const coordinatorCount = Math.max(1, Number(input.coordinatorCount));
    const capacityClosures = Math.max(0, Number(input.capacityClosures));
    const requiredNumerator = Math.ceil(projectedDenominator * targetRate / 100);
    const projectedNaturalNumerator = Math.min(projectedDenominator, currentNumerator + naturalClosures);
    const additionalClosures = Math.max(0, requiredNumerator - projectedNaturalNumerator);
    const bufferedClosures = Math.ceil(additionalClosures * (1 + bufferPct / 100));
    const maximumNumerator = Math.min(projectedDenominator, projectedNaturalNumerator + capacityClosures);
    return {
      currentRate: round(currentNumerator / currentDenominator * 100, 1),
      projectedDenominator,
      requiredNumerator,
      projectedNaturalNumerator,
      additionalClosures,
      bufferedClosures,
      closuresPerMonth: round(bufferedClosures / monthsRemaining, 1),
      closuresPerCoordinator: round(bufferedClosures / coordinatorCount, 1),
      maximumAchievableRate: round(maximumNumerator / projectedDenominator * 100, 1)
    };
  }

  function interventionResult(intervention, scale = 1) {
    const eligible = Math.max(0, Number(intervention.eligible) * scale);
    const reach = clamp(Number(intervention.reachRate), 0, 100) / 100;
    const effect = clamp(Number(intervention.effect), 0, 100) / 100;
    const contacted = eligible * reach;
    const closures = contacted * effect;
    const hours = contacted * Number(intervention.hoursPerMember);
    const cost = contacted * Number(intervention.costPerMember);
    return { eligible, contacted, closures, hours, cost };
  }

  function scenarioResult(scenario, interventions) {
    const denominator = Math.max(1, Number(scenario.denominator));
    const baselineRate = clamp(Number(scenario.baselineRate), 0, 100);
    const baselineNumerator = denominator * baselineRate / 100;
    const naturalClosures = denominator * clamp(Number(scenario.naturalClosureRate), 0, 100) / 100;
    const portfolio = interventions.filter(i => scenario.interventionIds.includes(i.id));
    const totals = portfolio.reduce((acc, item) => {
      const value = interventionResult(item, Number(scenario.scale || 1));
      Object.keys(value).forEach(key => { acc[key] += value[key]; });
      return acc;
    }, { eligible: 0, contacted: 0, closures: 0, hours: 0, cost: 0 });
    const overlapDiscount = clamp(Number(scenario.overlapDiscount || 0), 0, 90) / 100;
    totals.closures *= (1 - overlapDiscount);
    const projectedNumerator = Math.min(denominator, baselineNumerator + naturalClosures + totals.closures);
    const projectedRate = projectedNumerator / denominator * 100;
    const confidence = clamp(Number(scenario.confidence), 10, 100) / 100;
    const rangeWidth = Math.max(1, totals.closures * (1 - confidence) * .45);
    const capacityUtilization = Number(scenario.capacityHours) > 0 ? totals.hours / Number(scenario.capacityHours) * 100 : 0;
    return {
      ...totals,
      naturalClosures: round(naturalClosures, 1),
      incrementalClosures: round(totals.closures, 1),
      projectedRate: round(projectedRate, 1),
      lowRate: round((projectedNumerator - rangeWidth) / denominator * 100, 1),
      highRate: round(Math.min(denominator, projectedNumerator + rangeWidth) / denominator * 100, 1),
      capacityUtilization: round(capacityUtilization, 0),
      costPerClosure: totals.closures ? round(totals.cost / totals.closures, 0) : 0,
      unnecessaryContacts: round(totals.contacted * clamp(Number(scenario.unnecessaryContactRate || 0), 0, 100) / 100, 0)
    };
  }

  function portfolioResult(selected, capacityHours, budget) {
    const totals = selected.reduce((acc, item) => {
      const value = interventionResult(item);
      Object.keys(value).forEach(key => { acc[key] += value[key]; });
      return acc;
    }, { eligible: 0, contacted: 0, closures: 0, hours: 0, cost: 0 });
    return {
      ...totals,
      capacityUtilization: capacityHours ? round(totals.hours / capacityHours * 100, 0) : 0,
      budgetUtilization: budget ? round(totals.cost / budget * 100, 0) : 0,
      costPerClosure: totals.closures ? round(totals.cost / totals.closures, 0) : 0,
      overCapacity: totals.hours > capacityHours,
      overBudget: totals.cost > budget
    };
  }

  return { clamp, round, targetPlan, interventionResult, scenarioResult, portfolioResult };
});
