import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TokenPrice } from "../hooks/usePrices";
import { cn } from "../lib/utils";
import { TokenSelectModal } from "./TokenSelectModal";

interface TokenInputProps {
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  selectedToken: TokenPrice | null;
  onTokenSelect: (token: TokenPrice) => void;
  tokens: TokenPrice[];
  readOnly?: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  label,
  amount,
  onAmountChange,
  selectedToken,
  onTokenSelect,
  tokens,
  readOnly = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50 transition-colors focus-within:border-indigo-500/50 hover:border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-slate-400 font-medium">{label}</label>
          {selectedToken && amount && (
            <span className="text-xs text-slate-500 font-medium">
              ~$
              {(parseFloat(amount) * selectedToken.price).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 },
              )}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            readOnly={readOnly}
            className={cn(
              "bg-transparent text-3xl outline-none w-full font-semibold placeholder:text-slate-600 truncate",
              readOnly ? "cursor-default text-slate-300" : "text-slate-100",
            )}
            min="0"
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-full pl-2 pr-3 py-1.5 shrink-0 shadow-sm border border-slate-700/50"
          >
            {selectedToken ? (
              <>
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${selectedToken.currency}.svg`}
                    alt={selectedToken.currency}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg";
                    }}
                  />
                </div>
                <span className="font-semibold text-slate-200">
                  {selectedToken.currency}
                </span>
              </>
            ) : (
              <span className="font-semibold text-slate-300 ml-2">
                Select token
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <TokenSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokens={tokens}
        onSelect={(token) => {
          onTokenSelect(token);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
