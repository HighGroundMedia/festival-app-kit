import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

// LayoutAnimation needs an opt-in on old-architecture Android.
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Colors are fully overridable so this drops into any theme. */
export interface AccordionColors {
  card: string;
  body: string;
  border: string;
  edge: string;
  questionText: string;
  answerText: string;
  accent: string;
}

const DEFAULT_COLORS: AccordionColors = {
  card: "#1A1240",
  body: "#0D081F",
  border: "#332566",
  edge: "#241852",
  questionText: "#E6E6FA",
  answerText: "#B7ACDC",
  accent: "#CB39C6",
};

export interface AccordionItemProps {
  question: string;
  answer: string;
  /** Optional partial color overrides — merged over the defaults. */
  colors?: Partial<AccordionColors>;
  /** Optional font family for headings. */
  fontFamily?: string;
}

/** A single expand/collapse FAQ row with an animated open/close. */
export function AccordionItem({
  question,
  answer,
  colors,
  fontFamily,
}: AccordionItemProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View
      style={{
        marginBottom: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: 14,
        borderBottomWidth: expanded ? 1 : 3,
        borderBottomColor: expanded ? c.border : c.edge,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          backgroundColor: c.card,
        }}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <Text
          style={{
            flex: 1,
            marginRight: 16,
            color: c.questionText,
            fontFamily,
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {question}
        </Text>
        <Text style={{ color: c.accent, fontSize: 20, fontFamily }}>
          {expanded ? "−" : "+"}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8, backgroundColor: c.body }}>
          <Text style={{ color: c.answerText, fontSize: 13, lineHeight: 22 }}>
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
}
