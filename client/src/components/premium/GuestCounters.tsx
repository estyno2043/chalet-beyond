import { useGuests } from "@/contexts/GuestsContext";
import { usePremiumCopy } from "./copy";
import { MAX_GUESTS } from "@shared/pricing";
export function GuestCounters({ id }: { id: string }) {
  const { adults, children, setAdults, setChildren } = useGuests();
  const c = usePremiumCopy();
  return (
    <div className="guest-counters">
      {[
        {
          label: c.adults,
          value: adults,
          min: 1,
          max: MAX_GUESTS - children,
          set: setAdults,
        },
        {
          label: c.children,
          value: children,
          min: 0,
          max: MAX_GUESTS - adults,
          set: setChildren,
        },
      ].map((item, i) => (
        <div className="guest-counter" key={item.label}>
          <span id={`${id}-guest-${i}`}>{item.label}</span>
          <div
            className="guest-counter__control"
            role="group"
            aria-labelledby={`${id}-guest-${i}`}
          >
            <button
              type="button"
              disabled={item.value <= item.min}
              onClick={() => item.set(item.value - 1)}
              aria-label={`− ${item.label}`}
            >
              −
            </button>
            <output aria-live="polite" aria-atomic="true">
              {item.value}
            </output>
            <button
              type="button"
              disabled={item.value >= item.max}
              onClick={() => item.set(item.value + 1)}
              aria-label={`+ ${item.label}`}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
