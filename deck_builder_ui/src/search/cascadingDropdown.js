import React, {useState} from "react";


export function CascadingDropdown() {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedColors, setSelectedColors] = useState('')


    const categoryArray = ["Single Color", "2 Colors", "3 Colors", "4+ Colors"]

    const colorsMap = {
    single: ["{W} White", "{U} Blue", "{B} Black", "{R} Red", "{G} Green", "{C} Colorless"],
    twoColor: ["{UW} Azorius", "{UG} Simic", "{UB} Dimir", "{BG} Golgari", "{RG} Gruul", "{UR} Izzet", "{BW} Orzhov", "{BR} Rakdos",
      "{GW} Selesnya", "{RW} Boros"],
    threeColor: ["{WBG} Abzan", "{WUG} Bant", "{UWB} Esper", "{UBR} Grixis", "{WUR} Jeskai", "{BRG} Jund",  "{WBR} Mardu",
      "{UBG} Sultai", "{BRG} Temur"],
    fourColor: ["{UBRG} Glint", "{WURG} Ink", "{WBUG} Witch", "{WBUR} Yore", "{WUBRG} WUBRG"]
    }
    
    const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedItem(''); // reset second dropdown when category changes
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">-- How many colors --</option>
        {categoryArray.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      {selectedCategory && (
        <select value={selectedItem} onChange={handleItemChange}>
          <option value="">-- Select Options --</option>
          {colorsMap[selectedCategory].map((item) => (
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