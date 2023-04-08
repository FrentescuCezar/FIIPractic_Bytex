package com.fiipractic.pokemoncatalog.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class PokemonStatsGenerator {

    private static final Random RANDOM = new Random();

    public static int generateHP() {
        return generateRandomNumberInRange(50, 100, 2);
    }

    public static int generateAttack() {
        return generateRandomNumberInRange(50, 100, 2);
    }

    public static int generateSpecialAttack() {
        return generateRandomNumberInRange(50, 100, 2);
    }

    public static int generateDefense() {
        return generateRandomNumberInRange(50, 100, 2);
    }

    public static int generateSpecialDefense() {
        return generateRandomNumberInRange(50, 100, 2);
    }

    public static int generateSpeed() {
        return generateRandomNumberInRange(50, 100, 2);
    }

    public static int generateBaseEggSteps() {
        return generateRandomNumberInRange(2500, 40000, 4);
    }

    public static int generateExperienceGrowth() {
        return generateRandomNumberInRange(800000, 1250000, 1);
    }

    public static int calculateBaseTotal(int hp, int attack, int specialAttack, int specialDefense, int speed) {
        return hp + attack + specialAttack + specialDefense + speed;
    }

    private static int generateRandomNumberInRange(int min, int max, int bias) {
        int range = max - min + 1;
        int midpoint = min + (range / 2);
        int randomValue = 0;

        for (int i = 0; i < bias; i++) {
            randomValue -= RANDOM.nextInt(range) + min;
        }

        randomValue += midpoint * (bias * 2);

        return randomValue / (bias * 2 + 1);
    }

    public static List<String> generateRandomAbilities() throws IOException {
        List<String> abilitiesList = new ArrayList<>();

        // Use getResourceAsStream to access the file in the resources folder
        try (InputStream inputStream = PokemonStatsGenerator.class.getResourceAsStream("/abilities.txt");
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String abilitiesLine = reader.readLine();
            String[] abilitiesArray = abilitiesLine.split(",");
            for (String ability : abilitiesArray) {
                abilitiesList.add(ability.trim()); // trim removes leading/trailing spaces
            }
        }

        Collections.shuffle(abilitiesList);
        return abilitiesList.subList(0, 2);
    }
}
