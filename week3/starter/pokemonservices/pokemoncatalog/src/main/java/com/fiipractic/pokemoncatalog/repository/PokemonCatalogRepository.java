package com.fiipractic.pokemoncatalog.repository;

import com.fiipractic.pokemoncatalog.model.Poketex;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;


@RestController
public interface PokemonCatalogRepository extends JpaRepository<Poketex, Integer> {
    @CrossOrigin(origins = "http://localhost:3000")
    Page<Poketex> findAllByOrderByIdDesc(Pageable pageable);

    @CrossOrigin(origins = "http://localhost:3000")
    @Query(value = "SELECT * FROM poketex ORDER BY RANDOM()", nativeQuery = true)
    Page<Poketex> findRandomPokemons(Pageable pageable);

    @Query(value = "SELECT * FROM poketex WHERE username =:username ORDER BY RANDOM()", nativeQuery = true)
    Page<Poketex> findRandomPokemonsByUsername(String username, Pageable pageable);

    @CrossOrigin(origins = "http://localhost:3000")
    Page<Poketex> findByUsername(String username, Pageable pageable);

    @Query(value = "SELECT * FROM poketex p WHERE " +
            "p.prompt ~* :wordList OR " +
            "p.name ~* :wordList OR " +
            "lower(p.username) = ANY(string_to_array(lower(:wordList), ','))", nativeQuery = true)
    Page<Poketex> findRelatedPokemons(@Param("wordList") String wordList, Pageable pageable);
}
