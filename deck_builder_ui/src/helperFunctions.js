export const replaceTextWithManaSymbols = (text) => {
    const symbolMap = {
        "{B}": "",
        "{G}": "",
        "{R}": "",
        "{U}": "",
        "{W}": "",
        "{W}": "",
        //Need to verify the other text replacing symbols and find the symbols to save here
    }

    //Will need to add more to the regex to match other symbols that I need to replace too
    return text.replace(/{[WUBRGC]}/g, (match) => {
        const imagePath = manaSymbols[match];
        if (imagePath) {
          return `<img src="${imagePath}" alt="${match} mana" />`;
        }
        return match;
      });
}