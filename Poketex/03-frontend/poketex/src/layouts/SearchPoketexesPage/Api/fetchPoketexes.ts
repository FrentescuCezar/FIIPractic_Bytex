import PoketexModel from "../../../models/PoketexModel";

export const fetchPoketexes = async (url: string) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('The servers are down. Please try again later.');
    }
    const responseJson = await response.json();

    const responseData = responseJson.content;

    const loadedPoketexes: PoketexModel[] = [];
    for (const key in responseData) {
        const data = responseData[key];
        const poketex = new PoketexModel(
            data.id, data.name, data.username,
            data.description, data.image, data.seed,
            data.prompt, data.steps, data.generation,
            data.abilities, data.type1, data.type2,
            data.hp, data.attack, data.spAttack,
            data.defense, data.spDefense, data.speed,
            data.baseTotal, data.baseEggSteps, data.experienceGrowth, data.parent1, data.parent2,
        );
        loadedPoketexes.push(poketex);
    }

    return {
        poketexes: loadedPoketexes,
        totalElements: responseJson.totalElements,
        totalPages: responseJson.totalPages,
    };
};

export const searchHandleChange = (search: string, poketexesPerPage: number) => {
    if (search === '') {
        return '';
    } else {
        const searchWords = search.trim().split(/\s+/);
        const stopwords = ['a', 'the', 'an', 'and', 'or', 'in', 'on', 'at', 'with', 'by', 'made', 'without'];
        const filteredWords = searchWords.filter(word => !stopwords.includes(word.toLowerCase()));
        return `/api/poketex/related?prompt=${filteredWords}&page=<pageNumber>&size=${poketexesPerPage}`;
    }
};