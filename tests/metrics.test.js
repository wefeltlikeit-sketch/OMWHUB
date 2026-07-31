const test = require("node:test");
const assert = require("node:assert/strict");
const metrics = require("../assets/metrics.js");

test("target plan calculates required numerator and buffered closures", () => {
  const result = metrics.targetPlan({
    currentDenominator: 1200,
    currentNumerator: 330,
    targetRate: 35,
    denominatorChangePct: 0,
    naturalClosures: 52,
    bufferPct: 5,
    monthsRemaining: 6,
    coordinatorCount: 4,
    capacityClosures: 60
  });
  assert.equal(result.currentRate, 27.5);
  assert.equal(result.requiredNumerator, 420);
  assert.equal(result.additionalClosures, 38);
  assert.equal(result.bufferedClosures, 40);
  assert.equal(result.closuresPerMonth, 6.7);
  assert.equal(result.closuresPerCoordinator, 10);
});

test("target plan responds to denominator growth", () => {
  const result = metrics.targetPlan({
    currentDenominator: 1000,
    currentNumerator: 300,
    targetRate: 35,
    denominatorChangePct: 10,
    naturalClosures: 20,
    bufferPct: 0,
    monthsRemaining: 5,
    coordinatorCount: 2,
    capacityClosures: 40
  });
  assert.equal(result.projectedDenominator, 1100);
  assert.equal(result.requiredNumerator, 385);
  assert.equal(result.additionalClosures, 65);
  assert.equal(result.maximumAchievableRate, 32.7);
});

test("intervention result applies reach and incremental effect", () => {
  const result = metrics.interventionResult({
    eligible: 200,
    reachRate: 50,
    effect: 20,
    hoursPerMember: 0.5,
    costPerMember: 40
  });
  assert.equal(result.contacted, 100);
  assert.equal(result.closures, 20);
  assert.equal(result.hours, 50);
  assert.equal(result.cost, 4000);
});

test("scenario applies overlap and reports capacity", () => {
  const scenario = {
    denominator: 1000,
    baselineRate: 25,
    naturalClosureRate: 2,
    capacityHours: 40,
    confidence: 70,
    overlapDiscount: 20,
    unnecessaryContactRate: 10,
    scale: 1,
    interventionIds: ["x"]
  };
  const interventions = [{
    id: "x", eligible: 200, reachRate: 50, effect: 20,
    hoursPerMember: 0.5, costPerMember: 40
  }];
  const result = metrics.scenarioResult(scenario, interventions);
  assert.equal(result.incrementalClosures, 16);
  assert.equal(result.projectedRate, 28.6);
  assert.equal(result.capacityUtilization, 125);
  assert.equal(result.costPerClosure, 250);
});

test("portfolio detects budget and capacity constraints", () => {
  const result = metrics.portfolioResult([{
    eligible: 100, reachRate: 100, effect: 10,
    hoursPerMember: 1, costPerMember: 50
  }], 80, 4000);
  assert.equal(result.closures, 10);
  assert.equal(result.capacityUtilization, 125);
  assert.equal(result.budgetUtilization, 125);
  assert.equal(result.overCapacity, true);
  assert.equal(result.overBudget, true);
});
