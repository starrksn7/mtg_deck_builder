import React, { useState } from "react";

export function CascadingDropdown() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

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
    setSelectedItem('');
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
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
        <select value={selectedItem} onChange={handleItemChange}>
          <option value="">-- Select Options --</option>
          {colorsMap[selectedKey].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      )}

      {selectedItem && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Selected Value:</strong> {selectedItem}
        </div>
      )}
    </div>
  );
}
