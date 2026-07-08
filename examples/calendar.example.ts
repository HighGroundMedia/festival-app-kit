import { addEventToCalendar, buildICS, type CalendarEvent } from "../src/calendar";

// Tiny fake event — replace with your own.
const demo: CalendarEvent = {
  id: "demo-1",
  title: "The Placeholders (Demo Set)",
  date: "20260101",
  startTime: "5:00 PM",
  endTime: "6:00 PM",
  location: "Main Stage, Example Park",
  description: "A sample set used only to demo the calendar export.",
};

// Preview the generated .ics text:
console.log(buildICS(demo, { productName: "Example Fest", alarmMinutesBefore: 15 }));

// In a component, wire this to a button's onPress:
//   <Button title="Add to calendar" onPress={() => addEventToCalendar(demo, { productName: "Example Fest" })} />
export { demo, addEventToCalendar };
