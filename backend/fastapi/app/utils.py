from typing import Iterable

def price_band(price: float, r2: float | None):
    # same heuristic as frontend: clamp 5–25%
    if r2 is None:
        pct = 0.10
    else:
        raw = (1 - r2) * 0.35
        pct = max(0.05, min(0.25, raw))
    delta = price * pct
    return {
        'low': max(0.0, price - delta),
        'high': price + delta,
        'pct': pct
    }