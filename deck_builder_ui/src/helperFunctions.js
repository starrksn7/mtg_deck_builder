

export const replaceTextWithManaSymbols = (text) => {
    // Example: Replace mana codes with symbols using a simple string replacement
    return text.replace(/{R}/g, '<i class="ms ms-r ms-cost ms-shadow"></i>')  
               .replace(/{G}/g, '<i class="ms ms-g ms-cost ms-shadow"></i>') 
               .replace(/{U}/g, '<i class="ms ms-u ms-cost ms-shadow"></i>') 
               .replace(/{W}/g, '<i class="ms ms-w ms-cost ms-shadow"></i>')
               .replace(/{B}/g, '<i class="ms ms-b ms-cost ms-shadow"></i>')
               .replace(/{C}/g, '<i class="ms ms-c ms-cost ms-shadow"></i>')
               .replace(/{R\/P}/g, '<i class="ms ms-rp ms-cost ms-shadow"></i>')
               .replace(/{G\/P}/g, '<i class="ms ms-gp ms-cost ms-shadow"></i>')
               .replace(/{U\/P}/g, '<i class="ms ms-up ms-cost ms-shadow"></i>')
               .replace(/{W\/P}/g, '<i class="ms ms-wp ms-cost ms-shadow"></i>')
               .replace(/{B\/P}/g, '<i class="ms ms-bp ms-cost ms-shadow"></i>')
               .replace(/\{0\}/g, '<i class="ms ms-0 ms-cost ms-shadow"></i>')
               .replace(/\{1\}/g, '<i class="ms ms-1 ms-cost ms-shadow"></i>')
               .replace(/\{2\}/g, '<i class="ms ms-2 ms-cost ms-shadow"></i>')
               .replace(/\{3\}/g, '<i class="ms ms-3 ms-cost ms-shadow"></i>')
               .replace(/\{4\}/g, '<i class="ms ms-4 ms-cost ms-shadow"></i>')
               .replace(/\{5\}/g, '<i class="ms ms-5 ms-cost ms-shadow"></i>')
               .replace(/\{6\}/g, '<i class="ms ms-6 ms-cost ms-shadow"></i>')
               .replace(/\{7\}/g, '<i class="ms ms-7 ms-cost ms-shadow"></i>')
               .replace(/\{8\}/g, '<i class="ms ms-8 ms-cost ms-shadow"></i>')
               .replace(/\{9\}/g, '<i class="ms ms-9 ms-cost ms-shadow"></i>')
               .replace(/\{10\}/g, '<i class="ms ms-10 ms-cost ms-shadow"></i>')
               .replace(/\{11\}/g, '<i class="ms ms-11 ms-cost ms-shadow"></i>')
               .replace(/\{12\}/g, '<i class="ms ms-12 ms-cost ms-shadow"></i>')
               .replace(/\{13\}/g, '<i class="ms ms-13 ms-cost ms-shadow"></i>')
               .replace(/\{14\}/g, '<i class="ms ms-14 ms-cost ms-shadow"></i>')
               .replace(/\{15\}/g, '<i class="ms ms-15 ms-cost ms-shadow"></i>')
               .replace(/\{16\}/g, '<i class="ms ms-16 ms-cost ms-shadow"></i>')
               .replace(/\{17\}/g, '<i class="ms ms-17 ms-cost ms-shadow"></i>')
               .replace(/\{18\}/g, '<i class="ms ms-18 ms-cost ms-shadow"></i>')
               .replace(/\{19\}/g, '<i class="ms ms-19 ms-cost ms-shadow"></i>')
               .replace(/\{20\}/g, '<i class="ms ms-20 ms-cost ms-shadow"></i>')
               .replace(/{W\/U}/g, '<i class="ms ms-wu ms-cost ms-shadow"></i>')
               .replace(/{W\/B}/g, '<i class="ms ms-wb ms-cost ms-shadow"></i>')
               .replace(/{G\/U}/g, '<i class="ms ms-gu ms-cost ms-shadow"></i>')
               .replace(/{U\/B}/g, '<i class="ms ms-ub ms-cost ms-shadow"></i>')
               .replace(/{U\/R}/g, '<i class="ms ms-ur ms-cost ms-shadow"></i>')
               .replace(/{B\/R}/g, '<i class="ms ms-br ms-cost ms-shadow"></i>')
               .replace(/{B\/G}/g, '<i class="ms ms-bg ms-cost ms-shadow"></i>')
               .replace(/{R\/W}/g, '<i class="ms ms-rw ms-cost ms-shadow"></i>')
               .replace(/{R\/G}/g, '<i class="ms ms-rg ms-cost ms-shadow"></i>')
               .replace(/{G\/W}/g, '<i class="ms ms-gw ms-cost ms-shadow"></i>')
               .replace(/{W\/U\/P}/g, '<i class="ms ms-wup ms-cost ms-shadow"></i>')
               .replace(/{W\/B\/P}/g, '<i class="ms ms-wbp ms-cost ms-shadow"></i>')
               .replace(/{U\/B\/P}/g, '<i class="ms ms-ubp ms-cost ms-shadow"></i>')
               .replace(/{U\/R\/P}/g, '<i class="ms ms-urp ms-cost ms-shadow"></i>')
               .replace(/{B\/R\/P}/g, '<i class="ms ms-brp ms-cost ms-shadow"></i>')
               .replace(/{B\/G\/P}/g, '<i class="ms ms-bgp ms-cost ms-shadow"></i>')
               .replace(/{R\/W\/P}/g, '<i class="ms ms-rwp ms-cost ms-shadow"></i>')
               .replace(/{R\/G\/P}/g, '<i class="ms ms-rgp ms-cost ms-shadow"></i>')
               .replace(/{G\/W\/P}/g, '<i class="ms ms-gwp ms-cost ms-shadow"></i>')
               .replace(/{G\/U\/P}/g, '<i class="ms ms-gup ms-cost ms-shadow"></i>')
               .replace(/{2\/W}/g, '<i class="ms ms-2w ms-cost ms-shadow"></i>')
               .replace(/{2\/U}/g, '<i class="ms ms-2u ms-cost ms-shadow"></i>')
               .replace(/{2\/B}/g, '<i class="ms ms-2b ms-cost ms-shadow"></i>')
               .replace(/{2\/R}/g, '<i class="ms ms-2r ms-cost ms-shadow"></i>')
               .replace(/{2\/G}/g, '<i class="ms ms-2g ms-cost ms-shadow"></i>')
               .replace(/{C\/W}/g, '<i class="ms ms-cw ms-cost ms-shadow"></i>')
               .replace(/{C\/U}/g, '<i class="ms ms-cu ms-cost ms-shadow"></i>')
               .replace(/{C\/B}/g, '<i class="ms ms-cb ms-cost ms-shadow"></i>')
               .replace(/{C\/R}/g, '<i class="ms ms-cr ms-cost ms-shadow"></i>')
               .replace(/{C\/G}/g, '<i class="ms ms-cg ms-cost ms-shadow"></i>')
               .replace(/{T}/g, '<i class="ms ms-tap ms-cost ms-shadow"></i>')
               .replace(/{Q}/g, '<i class="ms ms-untap ms-cost"></i>')
               .replace(/{CHAOS}/g, '<i class="ms ms-chaos"></i>')
               .replace(/{X}/g, '<i class="ms ms-x ms-cost ms-shadow"></i>')
               .replace(/{Y}/g, '<i class="ms ms-y ms-cost ms-shadow"></i>')
               .replace(/{Z}/g, '<i class="ms ms-z ms-cost ms-shadow"></i>')
               .replace(/{E}/g, '<i class="ms ms-e"></i>')
               .replace(/{P}/g, '<i class="ms ms-paw"></i>')
               .replace(/{A}/g, '<i class="ms ms-acorn"></i>')
               .replace(/{TK}/g, '<i class="ms ms-ticket"></i>')
               .replace(/{S}/g, '<i class="ms ms-s ms-cost ms-shadow"></i>')
               .replace(/\{100\}/g, '<i class="ms ms-100 ms-cost ms-shadow"></i>')
               .replace(/\{1000000\}/g, '<i class="ms ms-1000000 ms-cost ms-shadow"></i>')
               .replace(/{HW}/g, '<i class="ms ms-w ms-half ms-cost"></i>')
               .replace(/{HR}/g, '<i class="ms ms-r ms-half ms-cost"></i>')
};

export const duplicateCardCheck = (cardList) => {
    let deckMap = new Map();

    let permittedDuplicateCards = ["Forest", "Island", "Plains", "Mountain", "Swamp",
            "Dragon's Approach", "Hare Apparent", "Persistent Petitioners", "Rat Colony", "Relentless Rats",
        "Shadowborn Apostle", "Slime Against Humanity", "Templar Knight", "Cid, Timeless Artificer"]

    let cardsWithCustomLimits = {
        "Seven Dwarves": 7,
        "Nazgul": 9
    }

    let cardsDuplicated = [];

    cardList.forEach((card) => {
        let currentCount = deckMap.get(card.name) || 0;
        deckMap.set(card.name, currentCount + 1);
    });

    deckMap.forEach((count, name) => {
        if (count > 1) {
            if (permittedDuplicateCards.includes(name)) {
                return;
            }

            if (cardsWithCustomLimits.hasOwnProperty(name)) {
                if (count > cardsWithCustomLimits[name]) {
                    cardsDuplicated.push(`${name} (has ${count}, max ${cardsWithCustomLimits[name]})`);
                }
                return;
            }

            cardsDuplicated.push(`${name} (has ${count}, max 1)`);
        }
    });

    return cardsDuplicated;
}

export const colorIdentityCheck = (cardList) => {
    const wrongIdentity = []

    cardList.forEach(card => {
        console.log("card name. = ", card.name)
        const cardColorIdentity = card.colorIdentity || [];
        const deckColorIdentity = card.deckColorIdentity || [];

        console.log("color identity = ", cardColorIdentity)
        console.log("deck identity = ", deckColorIdentity)

        const colorsMatch = cardColorIdentity.every(color => deckColorIdentity.includes(color));

        console.log("colorsMatch = ", colorsMatch)

        if (!colorsMatch){
            wrongIdentity.push(card.name);
        }
    })

    console.log("wrongIdentity")
    console.log(wrongIdentity)

    return wrongIdentity
}


export const createCardObject = (card) => {
    let colorIdentity = card.color_identity;
    let keyword = card.keywords

    if (typeof colorIdentity === 'string') {
        colorIdentity = colorIdentity
            .replace(/\[|\]/g, '')
            .split(',')
            .map(c => c.trim());
    }

    if (typeof keyword === 'string') {
        keyword = keyword
            .replace(/\[|\]/g, '')
            .split(',')
            .map(c => c.trim());
    }

    return {
        scryfallId: card.scryfallId,
        name: card.name,
        scryfallURL: card.scryfall_url,
        imageLink: card.image_link,
        type: card.type,
        oracleText: card.oracle_text,
        manaCost: card.mana_cost,
        colors: card.colors,
        colorIdentity: colorIdentity,
        keyword: keyword
    }
}

export const getBaseColors = (colorIdentity) => {
    let colors;

    switch(colorIdentity) {
        case ('blue'):
            colors = "u"
            break;
        case ('black'):
            colors = "b"
            break;
        case ('red'):
            colors = "r"
            break;
        case ('green'):
            colors = "g"
            break;
        case ('white'):
            colors = "w"
            break;
        case ('azorius'):
            colors = "uw"
            break;
        case ('simic'):
            colors = "ug"
            break;
        case ('dimir'):
            colors = "ub"
            break;
        case ('golgari'):
            colors = "bg"
            break;
        case ('gruul'):
            colors = "rg"
            break;
        case ('izzet'):
            colors = "ur"
            break;
        case ('orzhov'):
            colors = "bw"
            break;
        case ('rakdos'):
            colors = "br"
            break;
        case ('selesnya'):
            colors = "gw"
            break;
        case ('boros'):
            colors = "rw"
            break;
        case ('abzan'):
            colors = "wbg"
            break;
        case ('bant'):
            colors = "wug"
            break;
        case ('esper'):
            colors = "uwb"
            break;
        case ('grixis'):
            colors = "ubr"
            break;
        case ('jeskai'):
            colors = "wur"
            break;
        case ('jund'):
            colors = "brg"
            break;
        case ('mardu'):
            colors = "wbr"
            break;
        case ('sultai'):
            colors = "ubg"
            break;
        case ('temur'):
            colors = "brg"
            break;
        case ('glint'):
            colors = "ubrg"
            break;
        case ('ink'):
            colors = "wurg"
            break;
        case ('witch'):
            colors = "wbug"
            break;
        case ('yore'):
            colors = "wbur"
            break;
        case ('wubrg'):
            colors = "wubrg"
            break;
        case ('colorless'):
            colors = "c"
            break;
        default:
            colors = ""
    }
    
    return colors
}