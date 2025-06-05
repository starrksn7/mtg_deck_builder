import React, { useState } from "react";
import { replaceTextWithManaSymbols } from "../helperFunctions";
import "../css/customDropdown.css";

export function CascadingDropdown({ onColorSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColors, setSelectedColors] = useState('');

  const categories = [
    { label: "Single Color", key: "single" },
    { label: "2 Colors", key: "twoColor" },
    { label: "3 Colors", key: "threeColor" },
    { label: "4+ Colors", key: "fourColor" }
  ];

  const colorsMap = {
    single: ["{W} White", "{U} Blue", "{B} Black", "{R} Red", "{G} Green", "{C} Colorless"],
    twoColor: ["{UW} Azorius", "{UG} Simic", "{UB} Dimir", "{BG} Golgari", "{RG} Gruul", "{UR} Izzet", "{BW} Orzhov", "{BR} Rakdos", "{GW} Selesnya", "{RW} Boros"],
    threeColor: ["{WBG} Abzan", "{WUG} Bant", "{UWB} Esper", "{UBR} Grixis", "{WUR} Jeskai", "{BRG} Jund", "{WBR} Mardu", "{UBG} Sultai", "{BRG} Temur"],
    fourColor: ["{UBRG} Glint", "{WURG} Ink", "{WBUG} Witch", "{WBUR} Yore", "{WUBRG} WUBRG"]
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedColors('');
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setSelectedColors(value);
    onColorSelect?.(value);
  };

  const selectedKey = categories.find(c => c.label === selectedCategory)?.key;

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">-- How many colors --</option>
        {categories.map(({ label }) => (
          <option key={label} value={label}>{label}</option>
        ))}
      </select>

{selectedCategory && selectedKey && (
        <div className="custom-dropdown">
          <button className="dropdown-toggle" onClick={() => setSelectedColors('')}>
            <span
              dangerouslySetInnerHTML={{
                __html: selectedColors
                  ? replaceTextWithManaSymbols(selectedColors)
                  : '-- Select Options --',
              }}
            />
          </button>
          <ul className="dropdown-menu">
            {colorsMap[selectedKey].map(item => (
              <li
                key={item}
                className="dropdown-item"
                onClick={() => handleColorChange(item)}
              >
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(item) }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
