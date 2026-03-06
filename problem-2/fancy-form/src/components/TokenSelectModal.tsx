import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { TokenPrice } from "../hooks/usePrices";
import { motion, AnimatePresence } from "framer-motion";

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenPrice[];
  onSelect: (token: TokenPrice) => void;
}

export const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSelect,
}) => {
  const [search, setSearch] = useState("");

  const filteredTokens = useMemo(() => {
    return tokens.filter((t) =>
      t.currency.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tokens, search]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Select a token</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or paste address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-[300px] p-2">
            {filteredTokens.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No tokens found for "{search}"
              </div>
            ) : (
              <div className="grid gap-1">
                {filteredTokens.map((token) => (
                  <button
                    key={token.currency}
                    onClick={() => onSelect(token)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                        <img
                          src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`}
                          alt={token.currency}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg";
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {token.currency}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      ${token.price.toFixed(4).replace(/\.?0+$/, "")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
