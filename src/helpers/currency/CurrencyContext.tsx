"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

interface CurrencyType {
    currency: string;
    symbol: string;
    flag: string;
    value: number;
}

interface ContextProps {
    selectedCurrency: (cur: Partial<CurrencyType>) => void;
    selectedCurr: CurrencyType;
    currencies: CurrencyType[];
}

export const Context = createContext({} as ContextProps);

export const Provider = (props: { children: React.ReactNode }) => {
    // USD par défaut pour les panels admin
    const DEFAULT_CURRENCY = useMemo(() => ({ currency: "USD", symbol: "$", flag: "🇺🇸", value: 1 }), []);

    const CURRENCY_META = useMemo(
        () => [
            { currency: "USD", symbol: "$", flag: "🇺🇸" },
            { currency: "EUR", symbol: "€", flag: "🇪🇺" },
            { currency: "XOF", symbol: "FCFA", flag: "🇸🇳" },
            { currency: "XAF", symbol: "FCFA", flag: "🇨🇲" },
            { currency: "NGN", symbol: "₦", flag: "🇳🇬" },
            { currency: "GHS", symbol: "GH₵", flag: "🇬🇭" },
            { currency: "MAD", symbol: "د.م.", flag: "🇲🇦" },
            { currency: "DZD", symbol: "د.ج", flag: "🇩🇿" },
            { currency: "TND", symbol: "د.ت", flag: "🇹🇳" },
            { currency: "EGP", symbol: "£", flag: "🇪🇬" },
            { currency: "ZAR", symbol: "R", flag: "🇿🇦" },
            { currency: "KES", symbol: "KSh", flag: "🇰🇪" },
        ],
        []
    );

    const [rates, setRates] = useState<Record<string, number> | null>(null);
    const [selectedCurr, setSelectedCurr] = useState(DEFAULT_CURRENCY);

    // Liste des devises avec leurs taux
    const currencies = useMemo(() => {
        return CURRENCY_META.map((meta) => ({
            currency: meta.currency,
            symbol: meta.symbol,
            flag: meta.flag,
            value: rates?.[meta.currency] ?? 1,
        }));
    }, [CURRENCY_META, rates]);

    // Fonction pour changer de devise
    const selectedCurrency = useCallback(
        (cur: Partial<CurrencyType>) => {
            const currencyCode = String(cur?.currency || DEFAULT_CURRENCY.currency).toUpperCase();
            const meta = CURRENCY_META.find((m) => m.currency === currencyCode);
            const symbol = String(cur?.symbol || meta?.symbol || DEFAULT_CURRENCY.symbol);
            const flag = String(cur?.flag || meta?.flag || "🇺🇸");
            const computedValue = rates?.[currencyCode];
            const value = typeof computedValue === "number" ? computedValue : typeof cur?.value === "number" ? cur.value : 1;
            const next = { currency: currencyCode, symbol, flag, value };

            setSelectedCurr(next);
            try {
                if (typeof window !== "undefined") {
                    localStorage.setItem("admin_selected_currency", JSON.stringify(next));
                }
            } catch {
                // Ignore localStorage errors
            }
        },
        [CURRENCY_META, DEFAULT_CURRENCY.currency, DEFAULT_CURRENCY.symbol, rates]
    );

    // Charger les taux de change depuis le cache ou l'API
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const cached = localStorage.getItem("currency_rates_usd");
            if (cached) {
                const parsed = JSON.parse(cached);
                const ts = typeof parsed?.ts === "number" ? parsed.ts : 0;
                const savedRates = parsed?.rates && typeof parsed.rates === "object" ? parsed.rates : null;
                if (savedRates && Date.now() - ts < 24 * 60 * 60 * 1000) {
                    setRates(savedRates);
                    return;
                }
            }
        } catch {
            // Ignore cache errors
        }

        const load = async () => {
            try {
                const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", {
                    cache: "no-store",
                });
                if (!res.ok) return;
                const json = await res.json();
                const baseRates = json?.usd && typeof json.usd === "object" ? json.usd : null;
                if (!baseRates) return;
                const normalized: Record<string, number> = { USD: 1 };
                for (const [k, v] of Object.entries(baseRates)) {
                    if (typeof v === "number") {
                        const currencyCode = String(k).toUpperCase();
                        normalized[currencyCode] = v;
                    }
                }
                setRates(normalized);
                try {
                    localStorage.setItem("currency_rates_usd", JSON.stringify({ ts: Date.now(), rates: normalized }));
                } catch {
                    // Ignore localStorage errors
                }
            } catch {
                // Ignore fetch errors
            }
        };

        void load();
    }, []);

    // Mettre à jour la valeur de la devise sélectionnée quand les taux changent
    useEffect(() => {
        if (typeof window === "undefined" || !rates) return;

        setSelectedCurr((prev) => {
            const computedValue = rates?.[prev.currency];
            if (typeof computedValue !== "number" || computedValue === prev.value) return prev;
            const next = { ...prev, value: computedValue };
            try {
                localStorage.setItem("admin_selected_currency", JSON.stringify(next));
            } catch {
                // Ignore localStorage errors
            }
            return next;
        });
    }, [rates]);

    // Charger la devise sauvegardée ou utiliser USD par défaut
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const cached = localStorage.getItem("admin_selected_currency");
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && typeof parsed.currency === "string" && typeof parsed.symbol === "string" && typeof parsed.value === "number") {
                    const meta = CURRENCY_META.find((m) => m.currency === parsed.currency);
                    const flag = parsed.flag || meta?.flag || "🏳️";
                    setSelectedCurr({ ...parsed, flag });
                    return;
                }
            }
        } catch {
            // Ignore localStorage errors
        }

        // Pas de devise sauvegardée, utiliser USD par défaut
        setSelectedCurr(DEFAULT_CURRENCY);
    }, [DEFAULT_CURRENCY, CURRENCY_META]);

    const currencyContext = {
        selectedCurr,
        selectedCurrency,
        currencies,
    };

    return <Context.Provider value={currencyContext}>{props.children}</Context.Provider>;
};

export const { Consumer } = Context;

export { Context as CurrencyContext, Provider as CurrencyContextProvider };
