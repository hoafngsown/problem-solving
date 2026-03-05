// Solution A: Mathematical Formula
// Time complexity:  O(1), 
// Space complexity: O(1)
const sum_to_n_a = (n) => {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};

// Solution B: Iterative Loop.
// Time complexity: O(n) -> because we need to loop n times.
// Space complexity: O(1)
const sum_to_n_b = (n) => {
  if (n <= 0) return 0;

  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

// Solution C: Recursion.
// Time complexity: O(n) -> n recursive calls
// Space complexity: O(n) space
const sum_to_n_c = (n) => {
  if (n <= 1) return n > 0 ? n : 0;
  return n + sum_to_n_c(n - 1);
};


