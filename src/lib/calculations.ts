export function allocateIncome(
  amount: number,
  funds: { id: string; allocation_pct: number }[],
) {
  return funds.map((fund) => ({
    fund_id: fund.id,
    amount: (amount * Number(fund.allocation_pct)) / 100,
  }));
}

export function validateAllocationTotal(funds: { allocation_pct: number }[]) {
  const total = funds.reduce(
    (sum, fund) => sum + Number(fund.allocation_pct),
    0,
  );

  return {
    total,
    isValid: total <= 100,
  };
}
