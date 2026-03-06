import React, { useState, useEffect, useMemo } from "react";
import { usePrices, type TokenPrice } from "../hooks/usePrices";
import { TokenInput } from "./TokenInput";
import { ArrowDownUp, Loader2, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export const SwapForm: React.FC = () => {
  const { prices, loading, error } = usePrices();

  const [fromToken, setFromToken] = useState<TokenPrice | null>(null);
  const [toToken, setToToken] = useState<TokenPrice | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");

  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  // Set default tokens when prices load
  useEffect(() => {
    if (prices.length > 0 && !fromToken && !toToken) {
      const eth = prices.find((p) => p.currency === "ETH");
      const usdc = prices.find((p) => p.currency === "USDC");
      if (eth) setFromToken(eth);
      if (usdc) setToToken(usdc);

      // Fallbacks if ETH/USDC aren't found
      if (!eth && prices.length > 0) setFromToken(prices[0]);
      if (!usdc && prices.length > 1) setToToken(prices[1]);
    }
  }, [prices, fromToken, toToken]);

  const toAmount = useMemo(() => {
    if (!fromAmount || isNaN(Number(fromAmount)) || !fromToken || !toToken)
      return "";
    const fromVal = parseFloat(fromAmount);
    const toVal = (fromVal * fromToken.price) / toToken.price;
    // Format to avoid long decimals: up to 6 decimals, but remove trailing zeros
    return parseFloat(toVal.toFixed(6)).toString();
  }, [fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount); // Keep the calculated amount as the new 'from' amount to match user intent
  };

  const handleSwapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0)
      return;

    setIsSwapping(true);
    setSwapSuccess(false);

    // Simulate API call for the swap
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSwapping(false);
    setSwapSuccess(true);
    setFromAmount("");

    setTimeout(() => setSwapSuccess(false), 3000);
  };

  const isValid = useMemo(() => {
    if (!fromAmount) return false;
    const amount = Number(fromAmount);
    if (isNaN(amount) || amount <= 0) return false;
    if (!fromToken || !toToken) return false;
    if (fromToken.currency === toToken.currency) return false; // same token
    return true;
  }, [fromAmount, fromToken, toToken]);

  let buttonText = "Swap";
  if (!fromToken || !toToken) buttonText = "Select a token";
  else if (fromToken.currency === toToken.currency)
    buttonText = "Cannot swap same token";
  else if (!fromAmount) buttonText = "Enter an amount";
  else if (Number(fromAmount) <= 0) buttonText = "Invalid amount";

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 w-full max-w-md h-[400px] border border-slate-800/50 bg-[#0d111c] rounded-3xl shadow-xl">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-8 rounded-3xl w-full max-w-md text-center shadow-xl">
        <p className="font-semibold mb-2">Error Loading Data</p>
        <p className="text-sm opacity-80">
          Failed to load prices. Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md relative"
    >
      {/* Decorative gradient blob behind the form */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[32px] blur-xl opacity-20 pointer-events-none" />

      <div className="relative bg-[#0d111c] border border-slate-800/60 p-2 sm:p-4 rounded-[28px] shadow-2xl shadow-black/50">
        <div className="flex justify-between items-center px-4 py-3 mb-2">
          <h2 className="text-slate-100 font-semibold text-lg">Swap</h2>
          <button className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800/50 rounded-xl">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSwapSubmit}
          className="flex flex-col gap-1 relative"
        >
          <TokenInput
            label="You pay"
            amount={fromAmount}
            onAmountChange={setFromAmount}
            selectedToken={fromToken}
            onTokenSelect={setFromToken}
            tokens={prices}
          />

          {/* Swap direction toggle button */}
          <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handleSwapTokens}
              className="bg-[#0f1422] p-2 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all text-slate-300 group shadow-xl"
            >
              <ArrowDownUp className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          <TokenInput
            label="You receive"
            amount={toAmount}
            onAmountChange={() => {}} // Read-only
            selectedToken={toToken}
            onTokenSelect={setToToken}
            tokens={prices}
            readOnly
          />

          {fromToken && toToken && fromAmount && isValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-4 py-3 flex justify-between items-center text-sm font-medium"
            >
              <span className="text-slate-400">Exchange Rate</span>
              <span className="text-slate-300">
                1 {fromToken.currency} ={" "}
                {(fromToken.price / toToken.price).toFixed(6)}{" "}
                {toToken.currency}
              </span>
            </motion.div>
          )}

          <div className="mt-2 pt-2">
            <button
              type="submit"
              disabled={!isValid || isSwapping}
              className={cn(
                "w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2",
                isValid && !isSwapping
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                  : "bg-slate-800/50 text-slate-500 cursor-not-allowed",
                swapSuccess &&
                  "bg-emerald-500 hover:bg-emerald-500/90 text-white shadow-emerald-500/25",
              )}
            >
              {isSwapping ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Swapping...
                </>
              ) : swapSuccess ? (
                "Swap Successful!"
              ) : (
                buttonText
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
