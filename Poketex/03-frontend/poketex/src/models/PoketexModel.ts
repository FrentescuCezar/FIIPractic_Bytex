class PoketexModel {
    id: number;
    name: string;
    username: string
    description: string;
    image?: string;
    seed: string;
    prompt: string;
    steps: number;
    generation: number;
    parent1?: number;
    parent2?: number;
    abilities: string[];
    type1: string;
    type2: string;
    hp: number;
    attack: number;
    spAttack: number;
    defense: number;
    spDefense: number;
    speed: number;
    baseTotal: number;
    baseEggSteps: number;
    experienceGrowth: number;

    constructor(id: number, name: string, username: string, description: string, image: string, seed: string, prompt: string, steps: number, generation: number, abilities: string[], type1: string, type2: string, hp: number, attack: number, spAttack: number, defense: number, spDefense: number, speed: number, baseTotal: number, baseEggSteps: number, experienceGrowth: number, parent1?: number, parent2?: number) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.description = description;
        this.image = image;
        this.seed = seed;
        this.prompt = prompt;
        this.steps = steps;
        this.generation = generation;
        this.parent1 = parent1;
        this.parent2 = parent2;
        this.abilities = abilities;
        this.type1 = type1;
        this.type2 = type2;
        this.hp = hp;
        this.attack = attack;
        this.spAttack = spAttack;
        this.defense = defense;
        this.spDefense = spDefense;
        this.speed = speed;
        this.baseTotal = baseTotal;
        this.baseEggSteps = baseEggSteps;
        this.experienceGrowth = experienceGrowth;
    }
}

export default PoketexModel