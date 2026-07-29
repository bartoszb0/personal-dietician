type GoalHitTotals = { calories: number; proteinG: number };
type GoalHitTarget = { calories: number; proteinG: number };

export function isGoalHit(
  totals: GoalHitTotals,
  target: GoalHitTarget,
): boolean {
  const withinCalories =
    totals.calories >= target.calories * 0.9 &&
    totals.calories <= target.calories * 1.1;
  const proteinMet = totals.proteinG >= target.proteinG;
  return withinCalories && proteinMet;
}
