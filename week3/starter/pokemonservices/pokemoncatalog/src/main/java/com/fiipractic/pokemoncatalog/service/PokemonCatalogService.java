package com.fiipractic.pokemoncatalog.service;

import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.pokemoncatalog.repository.PokemonCatalogRepository;
import com.fiipractic.pokemoncatalog.requestmodel.PoketexRequest;
import com.fiipractic.pokemoncatalog.utils.PokemonStatsGenerator;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PokemonCatalogService {

    private final PokemonCatalogRepository pokemonCatalogRepository;

    public PokemonCatalogService(PokemonCatalogRepository pokemonCatalogRepository) {
        this.pokemonCatalogRepository = pokemonCatalogRepository;
    }

    public List<Pokedex> getPokemonDetailsByIds(List<Integer> pokemonIds) {
        List<Pokedex> pokemons = pokemonCatalogRepository.findAllById(pokemonIds);
        Map<Integer, Pokedex> pokemonMap = pokemons.stream().collect(Collectors.toMap(Pokedex::getId, Function.identity()));

        List<Pokedex> orderedPokemons = new ArrayList<>();
        for (Integer id : pokemonIds) {
            Pokedex pokemon = pokemonMap.get(id);
            if (pokemon != null) {
                orderedPokemons.add(pokemon);
            }
        }
        return orderedPokemons;
    }


    public Pokedex createPokedex(PoketexRequest pokedexRequest, String username) throws IOException {

        Pokedex pokedex = new Pokedex();

        pokedex.setName(pokedexRequest.getName());
        pokedex.setDescription(pokedexRequest.getDescription());
        pokedex.setPrompt(pokedexRequest.getPrompt());

        if (pokedexRequest.getNegativePrompt() != null && pokedexRequest.getNegativePrompt().isPresent()) {
            pokedex.setNegativePrompt(pokedexRequest.getNegativePrompt().map(Object::toString)
                    .orElse(null));
        }

        if(pokedexRequest.getParent1() != null && pokedexRequest.getParent1().isPresent()){
            pokedex.setParent1(pokedexRequest.getParent1().orElse(null));
        }

        if(pokedexRequest.getParent2() != null && pokedexRequest.getParent2().isPresent()){
            pokedex.setParent2(pokedexRequest.getParent2().orElse(null));
        }

        pokedex.setSteps(pokedexRequest.getSteps());
        pokedex.setSeed(pokedexRequest.getSeed());
        pokedex.setImage(pokedexRequest.getImage());
        pokedex.setGeneration(pokedexRequest.getGeneration());

        pokedex.setHp(PokemonStatsGenerator.generateHP());
        pokedex.setAttack(PokemonStatsGenerator.generateAttack());
        pokedex.setSpAttack(PokemonStatsGenerator.generateSpecialAttack());
        pokedex.setDefense(PokemonStatsGenerator.generateDefense());
        pokedex.setSpDefense(PokemonStatsGenerator.generateSpecialDefense());
        pokedex.setSpeed(PokemonStatsGenerator.generateSpeed());
        pokedex.setBaseEggSteps(PokemonStatsGenerator.generateBaseEggSteps());
        pokedex.setExperienceGrowth(PokemonStatsGenerator.generateExperienceGrowth());
        pokedex.setBaseTotal(PokemonStatsGenerator.calculateBaseTotal(pokedex.getHp(), pokedex.getAttack(), pokedex.getSpAttack(), pokedex.getSpDefense(), pokedex.getSpeed()));
        pokedex.setAbilities(PokemonStatsGenerator.generateRandomAbilities());
        pokedex.setUsername(username);

        return pokedex;
    }

}
