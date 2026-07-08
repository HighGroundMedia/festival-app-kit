import React from "react";
import { ScrollView } from "react-native";
import { AccordionItem } from "../src/AccordionItem";

// Tiny fake FAQ — replace with your own questions.
const FAQ = [
  { question: "What time do gates open?", answer: "Gates open at 9:00 AM each day." },
  { question: "Is parking free?", answer: "Yes — general parking is included with admission." },
];

export function FaqList() {
  return (
    <ScrollView style={{ padding: 16 }}>
      {FAQ.map((item) => (
        <AccordionItem key={item.question} question={item.question} answer={item.answer} />
      ))}
    </ScrollView>
  );
}
