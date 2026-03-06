import { useEffect, useState } from "react";
import axios from "axios";

export interface TokenPrice {
  currency: string;
  price: number;
  date?: string;
}

export const usePrices = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get<TokenPrice[]>(
          "https://interview.switcheo.com/prices.json",
        );

        // Some tokens might be duplicated in the JSON, let's keep unique ones.
        const priceMap = new Map<string, TokenPrice>();
        for (const p of response.data) {
          if (p.price) {
            priceMap.set(p.currency, p);
          }
        }

        setPrices(Array.from(priceMap.values()));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch prices"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { prices, loading, error };
};
