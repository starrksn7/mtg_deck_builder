

export const replaceTextWithManaSymbols = (text) => {
    // Example: Replace mana codes with symbols using a simple string replacement
    return text.replace(/{R}/g, '<i class="ms ms-r"></i>')  
               .replace(/{G}/g, '<i class="ms ms-g"></i>') 
               .replace(/{U}/g, '<i class="ms ms-u"></i>') 
               .replace(/{W}/g, '<i class="ms ms-w"></i>')
               .replace(/{B}/g, '<i class="ms ms-b"></i>');
};
