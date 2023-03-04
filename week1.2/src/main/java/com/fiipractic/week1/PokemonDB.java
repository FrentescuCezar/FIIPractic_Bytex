package com.fiipractic.week1;

import com.fiipractic.week1.models.Pokemon;

import java.util.ArrayList;
import java.util.List;

public class PokemonDB {
    private static List<Pokemon> pokemons = new ArrayList<Pokemon>();

    static{
        pokemons.add(new Pokemon(1, "Bulbasaur", "Grass/Poison", "Cezar", 99));
        pokemons.add(new Pokemon(2, "Ivysaur", "Grass/Poison", "Professor Oak", 40));
        pokemons.add(new Pokemon(3, "Venusaur", "Grass/Poison", "Professor Oak", 50));
        pokemons.add(new Pokemon(4, "Charmander", "Fire", "Red", 20));
        pokemons.add(new Pokemon(5, "Charmeleon", "Fire", "Red", 30));
        pokemons.add(new Pokemon(6, "Charizard", "Fire/Flying", "Red", 40));
        pokemons.add(new Pokemon(7, "Squirtle", "Water", "Misty", 15));
        pokemons.add(new Pokemon(8, "Wartortle", "Water", "Misty", 25));
        pokemons.add(new Pokemon(9, "Blastoise", "Water", "Misty", 35));
        pokemons.add(new Pokemon(10, "Caterpie", "Bug", "Bug Catcher", 5));
        pokemons.add(new Pokemon(11, "Metapod", "Bug", "Bug Catcher", 10));
        pokemons.add(new Pokemon(12, "Butterfree", "Bug/Flying", "Bug Catcher", 20));
        pokemons.add(new Pokemon(13, "Weedle", "Bug/Poison", "Weedle Guy", 5));
        pokemons.add(new Pokemon(14, "Kakuna", "Bug/Poison", "Weedle Guy", 10));
        pokemons.add(new Pokemon(15, "Beedrill", "Bug/Poison", "Weedle Guy", 20));
        pokemons.add(new Pokemon(16, "Pidgey", "Normal/Flying", "Bird Keeper", 5));
        pokemons.add(new Pokemon(17, "Pidgeotto", "Normal/Flying", "Bird Keeper", 15));
        pokemons.add(new Pokemon(18, "Pidgeot", "Normal/Flying", "Bird Keeper", 25));
        pokemons.add(new Pokemon(19, "Rattata", "Normal", "Youngster", 5));
        pokemons.add(new Pokemon(20, "Raticate", "Normal", "Youngster", 15));
    }
}
