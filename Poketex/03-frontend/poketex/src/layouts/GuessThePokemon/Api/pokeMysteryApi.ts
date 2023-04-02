import PoketexModel from "../../../models/PoketexModel";

export async function fetchPoketex(): Promise<PoketexModel> {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const baseUrl: string = `http://localhost:8085/`;
    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Something went wrong!");
    }

    const data = await response.json();
    const contentData = data;

    const loadedPoketex: PoketexModel = {
        id: contentData.id,
        name: contentData.name,
        username: contentData.username,
        description: contentData.description,
        image: contentData.image,
        seed: contentData.seed,
        prompt: contentData.prompt,
        steps: contentData.steps,
        generation: contentData.generation,
        abilities: contentData.abilities,
        type1: contentData.type1,
        type2: contentData.type2,
        hp: contentData.hp,
        attack: contentData.attack,
        spAttack: contentData.spAttack,
        defense: contentData.defense,
        spDefense: contentData.spDefense,
        speed: contentData.speed,
        baseTotal: contentData.baseTotal,
        baseEggSteps: contentData.baseEggSteps,
        experienceGrowth: contentData.experienceGrowth,
    };

    return loadedPoketex;
}

export async function postGuess(guess: string, pokemonIndex: number): Promise<string> {
    const baseUrl: string = `http://localhost:8085/guess`;
    const response = await fetch(`${baseUrl}?guess=${guess}&pokemonIndex=${pokemonIndex}`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
  
    const data = await response.json();
    return data.result;
  }