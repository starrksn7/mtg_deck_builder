import React, { useState } from "react";
import { replaceTextWithManaSymbols } from "../helperFunctions";
import "../css/customDropdown.css";

export function CascadingDropdown({ onColorSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColors, setSelectedColors] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const categories = [
    { label: "Single Color", key: "single" },
    { label: "2 Colors", key: "twoColor" },
    { label: "3 Colors", key: "threeColor" },
    { label: "4+ Colors", key: "fourColor" }
  ];

  const colorsMap = {
    single: ["{W} White", "{U} Blue", "{B} Black", "{R} Red", "{G} Green", "{C} Colorless"],
    twoColor: ["{U}{W} Azorius", "{U}{G} Simic", "{U}{B} Dimir", "{B}{G} Golgari", "{R}{G} Gruul", "{U}{R} Izzet", "{B}{W} Orzhov", "{B}{R} Rakdos", "{G}{W} Selesnya", "{R}{W} Boros"],
    threeColor: ["{W}{B}{G} Abzan", "{W}{U}{G} Bant", "{U}{W}{B} Esper", "{U}{B}{R} Grixis", "{W}{U}{R} Jeskai", "{B}{R}{G} Jund", "{W}{B}{R} Mardu", "{U}{B}{G} Sultai", "{B}{R}{G} Temur"],
    fourColor: ["{U}{B}{R}{G} Glint", "{W}{U}{R}{G} Ink", "{W}{B}{U}{G} Witch", "{W}{B}{U}{R} Yore", "{W}{U}{B}{R}{G} WUBRG"]
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedColors('');
  };

  const handleColorChange = (e) => {
    const value = e.split(" ")[1];
    setSelectedColors(value);
    onColorSelect?.(value);
  };

  const selectedKey = categories.find(c => c.label === selectedCategory)?.key;

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <select className="styled-select" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">-- How many colors --</option>
        {categories.map(({ label }) => (
          <option key={label} value={label}>{label}</option>
        ))}
      </select>

      {selectedCategory && selectedKey && (
        <div className="custom-dropdown">
          <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(prev => !prev)}>
            <span
              dangerouslySetInnerHTML={{
                __html: selectedColors
                  ? replaceTextWithManaSymbols(selectedColors)
                  : '-- Select Options --',
              }}
            />
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              {colorsMap[selectedKey].map(item => (
                <li
                  key={item}
                  className="dropdown-item"
                  onClick={() => {
                    handleColorChange(item);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(item) }} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
