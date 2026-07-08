import { Platform, Linking } from "react-native";

/**
 * A single calendar event. Times are "floating" local time — the event shows at
 * the printed clock time on any attendee's phone, regardless of their timezone,
 * which is usually what you want for a physical event with a fixed schedule.
 */
export interface CalendarEvent {
  /** Stable unique id, used to build the iCalendar UID. */
  id: string;
  /** Event title, e.g. an artist or session name. */
  title: string;
  /** Event day as YYYYMMDD, e.g. "20260727". */
  date: string;
  /** Start time in 12h format, e.g. "5:00 PM". */
  startTime: string;
  /** End time in 12h format. Defaults to a 60-minute block when omitted. */
  endTime?: string;
  /** Optional human-readable location, e.g. "Main Stage, City Park". */
  location?: string;
  /** Optional longer description. */
  description?: string;
}

export interface CalendarOptions {
  /**
   * Short product name used in the iCalendar PRODID and the UID domain, e.g.
   * "My Festival". Defaults to "festival-app-kit".
   */
  productName?: string;
  /** Minutes before start to fire a reminder alarm. Defaults to 15. Set 0 to disable. */
  alarmMinutesBefore?: number;
}

// "5:00 PM" -> { h, m } in 24h
function parseTime(t: string): { h: number; m: number } {
  const [time, period] = t.trim().split(" ");
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return { h, m };
}

const pad = (n: number) => String(n).padStart(2, "0");

// Returns DTSTART/DTEND stamps like 20260727T170000 / 20260727T180000.
function stamps(event: CalendarEvent) {
  const start = parseTime(event.startTime);
  const end = event.endTime
    ? parseTime(event.endTime)
    : { h: (start.h + 1) % 24, m: start.m };
  return {
    start: `${event.date}T${pad(start.h)}${pad(start.m)}00`,
    end: `${event.date}T${pad(end.h)}${pad(end.m)}00`,
  };
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "event";

/** Build a universal .ics string (opens in Apple / Google / Outlook). */
export function buildICS(event: CalendarEvent, options: CalendarOptions = {}): string {
  const productName = options.productName ?? "festival-app-kit";
  const alarm = options.alarmMinutesBefore ?? 15;
  const domain = slug(productName);
  const { start, end } = stamps(event);
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${esc(productName)}//EN`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@${domain}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${esc(event.title)}`,
  ];
  if (event.location) lines.push(`LOCATION:${esc(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${esc(event.description)}`);
  if (alarm > 0) {
    lines.push(
      "BEGIN:VALARM",
      `TRIGGER:-PT${alarm}M`,
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(event.title)} starts soon`,
      "END:VALARM"
    );
  }
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

/** Build a Google Calendar "add event" URL. */
export function googleUrl(event: CalendarEvent): string {
  const { start, end } = stamps(event);
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
  });
  if (event.location) p.set("location", event.location);
  if (event.description) p.set("details", event.description);
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/**
 * Add an event to the user's calendar — with a built-in reminder alarm.
 *   Web:    downloads a universal .ics (opens in Apple/Google/Outlook).
 *   Native: opens a Google Calendar prefilled event (no extra dependencies).
 */
export function addEventToCalendar(event: CalendarEvent, options: CalendarOptions = {}) {
  if (Platform.OS === "web") {
    const blob = new Blob([buildICS(event, options)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug(event.title)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    Linking.openURL(googleUrl(event));
  }
}
