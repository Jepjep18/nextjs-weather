"use client";  // ✅ Add this to make it a Client Component

import { useState } from "react";
import axios from "axios";

const API_KEY = "c4cfff6285d6f6370da05c9a630efad8"; // Replace with your actual API Key

interface WeatherData {
  name: string;
  main: { temp: number };
  wind: { speed: number };
  weather: { description: string }[];
}

const fetchWeather = async (city: string): Promise<WeatherData | null> => {
  if (!city) return null;

  try {
    const response = await axios.get<WeatherData>(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},PH&units=metric&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handleSearch = async () => {
    const data = await fetchWeather(city);
    setWeather(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">🌤 Philippine Weather App</h1>

      <input
        type="text"
        placeholder="Enter Philippine City (e.g., Manila)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded-md"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded-md mt-2"
      >
        Get Weather
      </button>

      {weather && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-bold">{weather.name}, PH</h2>
          <p>🌡 Temperature: {weather.main.temp}°C</p>
          <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
          <p>🌦 Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
