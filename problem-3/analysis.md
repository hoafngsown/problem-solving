# Problem 3: Code Review

Looking at this React component, there are several issues ranging from straight-up bugs to performance problems.

## Bugs

**1. `lhsPriority` is undefined**

```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {  // -> lhsPriority doesn't exist, should be balancePriority
```

This will throw a ReferenceError at runtime.

**2. Filter logic is backwards**

The filter returns `true` when `balance.amount <= 0`. So it keeps wallets with zero or negative balances and throws away the ones with actual money ->I'm sure that's not intended.

**3. `blockchain` property doesn't exist**

`WalletBalance` interface has `currency` and `amount`, but the code accesses `balance.blockchain`. TypeScript -> catch this.

**4. Sort doesn't handle equal values**

```ts
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
}
// returns undefined when equal -> undefined behavior
```

Should return `0` when priorities are equal.

## Type Issues

- `getPriority(blockchain: any)` — using `any` defeats the purpose of TypeScript
- `FormattedWalletBalance` duplicates `currency` and `amount` instead of extending `WalletBalance`
- `interface Props extends BoxProps {}` — empty interface, just use `BoxProps` directly

## Performance

- `getPriority` is called twice for each item during sort, and once during filter. Should compute once and reuse.
- `prices` is in useMemo dependencies but never used inside — causes unnecessary recalculations.
- `formattedBalances` is computed but then `rows` maps over `sortedBalances` instead -> the formatted data is thrown away. This one isn't memoized -> recalculates every render.
- `formattedBalances`

## React Issues

- Using array index as `key` — bad for lists that can reorder or filter
- `children` is destructured but never used
- `classes.row` referenced but `classes` is never defined/imported

## Minor

- Mixed tabs and spaces
- `toFixed()` without argument defaults to 0 decimal places
- No null check on `prices[balance.currency]`

---

## Refactored Version

```tsx
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

const WalletPage: React.FC<BoxProps> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0; // fixed logic
      })
      .sort((a: WalletBalance, b: WalletBalance) => {
        return getPriority(b.blockchain) - getPriority(a.blockchain);
      })
      .map(
        (balance: WalletBalance): FormattedWalletBalance => ({
          ...balance,
          formatted: balance.amount.toFixed(2),
        }),
      );
  }, [balances]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
```

Main changes:

- Fixed the undefined variable bug
- Fixed filter to keep positive balances
- Moved `getPriority` outside component with a lookup object instead of switch
- Combined filter/sort/format into one memoized operation
- Used `currency` as key instead of index
- Added proper types throughout
