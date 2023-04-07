import PoketexModel from "../../../models/PoketexModel";

interface FetchPoketexResult {
    loadedPoketexes: PoketexModel[];
    totalAmountOfPoketexes: number;
    totalPages: number;
}

const fetchPoketex = async (currentPage: number, poketexUsername: string, poketexesPerPage: number) => {
    let baseUrl: string = `http://localhost:8084/api/poketex/user?username=${poketexUsername}`;
    let url: string = `${baseUrl}&page=${currentPage - 1}&size=${poketexesPerPage}`;


    const response = await fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('The Servers are down. Please try again later.');
    }
    const responseJson = await response.json();

    let responseData;
    responseData = responseJson.content;

    const loadedPoketexes: PoketexModel[] = [];
    for (const key in responseData) {

        const data = responseData[key];
        let id: number;
        id = data.id;


        const poketex = new PoketexModel(
            id, data.name, data.username, // Use the extracted ID here
            data.description, data.image, data.seed,
            data.prompt, data.steps, data.generation,
            data.abilities, data.type1, data.type2,
            data.hp, data.attack, data.spAttack,
            data.defense, data.spDefense, data.speed,
            data.baseTotal, data.baseEggSteps, data.experienceGrowth, data.parent1, data.parent2
        );
        loadedPoketexes.push(poketex);
    }

    return {
        loadedPoketexes,
        totalAmountOfPoketexes: responseJson.totalElements,
        totalPages: responseJson.totalPages
    };

};

export default fetchPoketex;