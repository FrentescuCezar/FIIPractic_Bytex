package com.fiipractic.pokemoncatalog.service;

import com.fiipractic.pokemoncatalog.model.Poketex;
import com.fiipractic.pokemoncatalog.repository.PokemonCatalogRepository;
import com.fiipractic.pokemoncatalog.requestmodel.PoketexRequest;
import com.fiipractic.pokemoncatalog.utils.PokemonStatsGenerator;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PokemonCatalogService {

    private final PokemonCatalogRepository pokemonCatalogRepository;

    public PokemonCatalogService(PokemonCatalogRepository pokemonCatalogRepository) {
        this.pokemonCatalogRepository = pokemonCatalogRepository;
    }

    public Poketex save(Poketex poketex) {
        return pokemonCatalogRepository.save(poketex);
    }

    public Optional<Poketex> findById(Integer id) {
        return pokemonCatalogRepository.findById(id);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    public Page<Poketex> findAllByOrderByIdDesc(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return pokemonCatalogRepository.findAllByOrderByIdDesc(pageable);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    public Page<Poketex> findRandomPokemons(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return pokemonCatalogRepository.findRandomPokemons(pageable);
    }

    public Page<Poketex> findRandomPokemonsByUsername(String username, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return pokemonCatalogRepository.findRandomPokemonsByUsername(username, pageable);
    }

    public Page<Poketex> findByUsername(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return pokemonCatalogRepository.findByUsername(username, pageable);
    }

    public Page<Poketex> findRelatedPokemons(String prompt, int page, int size) {
        String joinedPrompt = String.join("|", prompt.replaceAll("[,;]", " ").split("\\s+"));
        Pageable pageable = PageRequest.of(page, size);
        return pokemonCatalogRepository.findRelatedPokemons(joinedPrompt, pageable);
    }

    public List<Poketex> getOrderedPokemonDetailsByIds(List<Integer> pokemonIds) {
        List<Poketex> pokemons = pokemonCatalogRepository.findAllById(pokemonIds);
        Map<Integer, Poketex> pokemonMap = pokemons.stream().collect(Collectors.toMap(Poketex::getId, Function.identity()));

        List<Poketex> orderedPokemons = new ArrayList<>();
        for (Integer id : pokemonIds) {
            Poketex pokemon = pokemonMap.get(id);
            if (pokemon != null) {
                orderedPokemons.add(pokemon);
            }
        }
        return orderedPokemons;
    }
    public Poketex createPoketex(PoketexRequest poketexRequest, String username) throws IOException {

        Poketex poketex = new Poketex();

        poketex.setName(poketexRequest.getName());
        poketex.setDescription(poketexRequest.getDescription());
        poketex.setPrompt(poketexRequest.getPrompt());

        if (poketexRequest.getNegativePrompt() != null && poketexRequest.getNegativePrompt().isPresent()) {
            poketex.setNegativePrompt(poketexRequest.getNegativePrompt().map(Object::toString)
                    .orElse(null));
        }

        if(poketexRequest.getParent1() != null && poketexRequest.getParent1().isPresent()){
            poketex.setParent1(poketexRequest.getParent1().orElse(null));
        }

        if(poketexRequest.getParent2() != null && poketexRequest.getParent2().isPresent()){
            poketex.setParent2(poketexRequest.getParent2().orElse(null));
        }

        poketex.setSteps(poketexRequest.getSteps());
        poketex.setSeed(poketexRequest.getSeed());
        poketex.setImage(poketexRequest.getImage());
        poketex.setGeneration(poketexRequest.getGeneration());

        poketex.setHp(PokemonStatsGenerator.generateHP());
        poketex.setAttack(PokemonStatsGenerator.generateAttack());
        poketex.setSpAttack(PokemonStatsGenerator.generateSpecialAttack());
        poketex.setDefense(PokemonStatsGenerator.generateDefense());
        poketex.setSpDefense(PokemonStatsGenerator.generateSpecialDefense());
        poketex.setSpeed(PokemonStatsGenerator.generateSpeed());
        poketex.setBaseEggSteps(PokemonStatsGenerator.generateBaseEggSteps());
        poketex.setExperienceGrowth(PokemonStatsGenerator.generateExperienceGrowth());
        poketex.setBaseTotal(PokemonStatsGenerator.calculateBaseTotal(poketex.getHp(), poketex.getAttack(), poketex.getSpAttack(), poketex.getSpDefense(), poketex.getSpeed()));
        poketex.setAbilities(PokemonStatsGenerator.generateRandomAbilities());


        int atSymbolIndex = username.indexOf('@');
        if (atSymbolIndex >= 0)
           username = username.substring(0, atSymbolIndex);

        poketex.setUsername(username);

        return poketex;
    }

}
