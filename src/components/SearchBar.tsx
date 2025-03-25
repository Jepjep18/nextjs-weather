"use client";
import { useState } from "react";

type SearchBarProps = {
  onSearch: (city: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() !== "") {
      onSearch(city);
      setCity(""); // Clear input after search
    }
  };

  return (
    <div className="flex gap-2 p-4">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full p-2 border rounded-lg text-black"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
}
