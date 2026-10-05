import { createContext, useContext, useState, type ReactNode } from "react";
import { MAX_GUESTS } from "@shared/pricing";
type Guests = {
  adults: number;
  children: number;
  setAdults: (value: number) => void;
  setChildren: (value: number) => void;
};
const Context = createContext<Guests | null>(null);
export function GuestsProvider({ children: content }: { children: ReactNode }) {
  const [adults, adultState] = useState(2);
  const [children, childState] = useState(0);
  return (
    <Context.Provider
      value={{
        adults,
        children,
        setAdults: value =>
          adultState(
            Math.max(1, Math.min(MAX_GUESTS - children, Math.round(value)))
          ),
        setChildren: value =>
          childState(
            Math.max(0, Math.min(MAX_GUESTS - adults, Math.round(value)))
          ),
      }}
    >
      {content}
    </Context.Provider>
  );
}
export function useGuests() {
  const guests = useContext(Context);
  if (!guests) throw new Error("GuestsProvider is required");
  return guests;
}
