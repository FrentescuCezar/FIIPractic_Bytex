package com.fiipractic.whos.that.pokemon.controller;

import com.fiipractic.whos.that.pokemon.model.Pokemon;
import com.fiipractic.whos.that.pokemon.service.WhosThatPokemonService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WhosThatPokemonController {

    private final WhosThatPokemonService whosThatPokemonService;

    public WhosThatPokemonController(WhosThatPokemonService whosThatPokemonService) {
        this.whosThatPokemonService = whosThatPokemonService;
    }

    @GetMapping(value = "/")
    public String whosThatPokemon(Model model){

        Pokemon pokemon = whosThatPokemonService.getRandomPokemon();
        model.addAttribute("pokemonIndex", pokemon.getId());

        return "whos-that-pokemon";
    }

    @PostMapping(value = "/guess")
    public String guessPokemon(@RequestParam String guess, @RequestParam Integer pokemonIndex, Model model){
        System.out.println(guess);
        System.out.println(pokemonIndex);


        Pokemon pokemon = whosThatPokemonService.getPokemonById(pokemonIndex);

        String result ="";

        if(guess.equalsIgnoreCase(pokemon.getName())){
            result = "Correct!";
        }
        else{
            result = "Wrong! The correct answers is " + pokemon.getName() + "!";
        }

        System.out.println(pokemon);
        System.out.println(result);

        model.addAttribute("pokemonIndex",pokemonIndex);
        model.addAttribute("result",result);

        return "whos-that-pokemon";
    }
}
