# festival-app-kit

A small set of reusable, framework-native building blocks extracted from a
real, volunteer-run **festival web/mobile app** (built with Expo / React
Native). Shared so other community events can fork the useful bits instead of
rebuilding them.

Everything here is standalone, dependency-light, and free of any
event-specific or personal data. Fork it, drop a module into your app, and go.

## What's included

| Module | File | What it does |
| --- | --- | --- |
| **Calendar export** | [`src/calendar.ts`](src/calendar.ts) | Add an event to the user's calendar with a reminder alarm. Web downloads a universal `.ics`; native opens a prefilled Google Calendar event. No native dependencies. |
| **`useWeather` hook** | [`src/useWeather.ts`](src/useWeather.ts) | Current conditions for a fixed lat/lon via the free [Open-Meteo](https://open-meteo.com) API — **no API key required**. Returns temp, wind, and an emoji/label for the WMO weather code. |
| **`AccordionItem`** | [`src/AccordionItem.tsx`](src/AccordionItem.tsx) | An animated expand/collapse FAQ row. Fully theme-overridable via a `colors` prop. |

Runnable minimal examples for each live in [`examples/`](examples).

## Requirements

- React 18+ and React Native (works under Expo). The `AccordionItem` and
  calendar helpers use `react-native`; `useWeather` only needs `react` + `fetch`.

## Usage

```ts
import { addEventToCalendar } from "./src/calendar";

addEventToCalendar(
  {
    id: "set-42",
    title: "The Placeholders",
    date: "20260101",       // YYYYMMDD
    startTime: "5:00 PM",
    endTime: "6:00 PM",
    location: "Main Stage, Example Park",
    description: "A sample set.",
  },
  { productName: "Example Fest", alarmMinutesBefore: 15 }
);
```

```tsx
import { useWeather } from "./src/useWeather";

const { weather, loading, error } = useWeather({ latitude: 42.9, longitude: -78.4 });
```

```tsx
import { AccordionItem } from "./src/AccordionItem";

<AccordionItem question="What time do gates open?" answer="9:00 AM daily." />
```

See [`examples/`](examples) for complete, copy-pasteable snippets.

## License

[MIT](LICENSE) © 2026 Dave Bruno. Contributions welcome — see
[CONTRIBUTING.md](CONTRIBUTING.md).
