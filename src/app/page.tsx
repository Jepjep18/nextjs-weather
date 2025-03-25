"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSearch, FiSun, FiMoon } from "react-icons/fi";

const API_KEY = "c4cfff6285d6f6370da05c9a630efad8";
const defaultCities = ["Manila", "Cebu", "Davao"];

interface WeatherData {
  name: string;
  main: { temp: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
}

const fetchWeather = async (city: string): Promise<WeatherData | null> => {
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
  const [defaultWeather, setDefaultWeather] = useState<WeatherData[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      const data = await Promise.all(defaultCities.map(fetchWeather));
      setDefaultWeather(data.filter((w) => w !== null) as WeatherData[]);
    };

    fetchDefaultWeather();
  }, []);

  const handleSearch = async () => {
    const data = await fetchWeather(city);
    setWeather(data);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 text-white transition-all duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-600 to-blue-500"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 bg-white/30 p-3 rounded-full shadow-lg hover:bg-white/40 transition-all"
      >
        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      {/* Title Animation */}
      <motion.h1
        className="text-4xl font-extrabold tracking-wider mb-6 drop-shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌎 Philippine Weather
      </motion.h1>

      {/* Search Box */}
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg ${
          darkMode ? "bg-gray-700" : "bg-white/20 backdrop-blur-lg"
        }`}
      >
        <input
          type="text"
          placeholder="Enter City (e.g., Manila)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`bg-transparent outline-none text-lg w-64 ${
            darkMode ? "text-white placeholder-gray-300" : "text-white placeholder-white"
          }`}
        />
        <button
          onClick={handleSearch}
          className="bg-white/30 text-white p-3 rounded-full shadow-lg hover:bg-white/40 transition-transform transform hover:scale-105"
        >
          <FiSearch size={20} />
        </button>
      </div>

      {/* Search Result */}
      {weather && (
        <motion.div
          className={`mt-6 p-6 rounded-2xl shadow-2xl text-center ${
            darkMode ? "bg-gray-800" : "bg-white/20 backdrop-blur-md"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold drop-shadow-lg">{weather.name}, PH</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            className="w-24 mx-auto"
          />
          <p className="text-2xl font-semibold mt-2">🌡 {weather.main.temp}°C</p>
          <p className="text-lg mt-1 opacity-80">💨 Wind: {weather.wind.speed} m/s</p>
          <p className="text-lg mt-1 opacity-80">🌦 {weather.weather[0].description}</p>
        </motion.div>
      )}

      {/* Default Cities Weather */}
      <h2 className="text-2xl font-bold mt-8">🌍 Default Cities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {defaultWeather.map((cityWeather) => (
          <motion.div
            key={cityWeather.name}
            className={`p-6 rounded-2xl shadow-2xl text-center w-72 ${
              darkMode ? "bg-gray-800" : "bg-white/20 backdrop-blur-md"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold">{cityWeather.name}, PH</h3>
            <img
              src={`https://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="w-20 mx-auto"
            />
            <p className="text-lg font-semibold mt-2">🌡 {cityWeather.main.temp}°C</p>
            <p className="text-md mt-1 opacity-80">💨 Wind: {cityWeather.wind.speed} m/s</p>
            <p className="text-md mt-1 opacity-80">🌦 {cityWeather.weather[0].description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
