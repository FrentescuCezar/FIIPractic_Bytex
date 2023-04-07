package com.fiipractic.pokemoncatalog.repository;

import com.fiipractic.pokemoncatalog.model.Pokedex;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public interface PokemonCatalogRepository extends JpaRepository<Pokedex, Integer> {
    Page<Pokedex> findByNameContainingIgnoreCaseOrPromptContainingIgnoreCase(String name, String prompt, Pageable pageable);


    @CrossOrigin(origins = "http://localhost:3000")
    Page<Pokedex> findAllByOrderByIdDesc(Pageable pageable);

    @Query(value = "SELECT * FROM pokedex ORDER BY RANDOM()", nativeQuery = true)
    Page<Pokedex> getRandomPokemons(Pageable pageable);

    @Query(value = "SELECT * FROM pokedex WHERE username =:username ORDER BY RANDOM()", nativeQuery = true)
    Page<Pokedex> getRandomPokemonByUsername(String username, Pageable pageable);

    @CrossOrigin(origins = "http://localhost:3000")
    Page<Pokedex> findByUsername(String username, Pageable pageable);

    @Query(value = "SELECT * FROM pokedex p WHERE p.prompt ~* :wordList OR p.name ~* :wordList OR p.username = ANY(string_to_array(:wordList, ','))", nativeQuery = true)
    Page<Pokedex> findRelatedPokemons(@Param("wordList") String wordList, Pageable pageable);
}
