import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useWeather } from "../src/useWeather";

// Fake coordinates (Null Island, 0,0) — swap for your venue's lat/lon.
export function WeatherBadge() {
  const { weather, loading, error } = useWeather({
    latitude: 0,
    longitude: 0,
    timezone: "auto",
  });

  if (loading) return <ActivityIndicator />;
  if (error || !weather) return <Text>Weather unavailable</Text>;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Text style={{ fontSize: 24 }}>{weather.icon}</Text>
      <Text>
        {weather.temp}° · {weather.label} · {weather.wind} mph
      </Text>
    </View>
  );
}
