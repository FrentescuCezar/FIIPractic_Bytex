package com.fiipractic.stablediffusion.repository;

import com.fiipractic.pokemoncatalog.model.Pokedex;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
public interface StableDiffusionRepository extends JpaRepository<Pokedex, Integer>, JpaSpecificationExecutor<Pokedex> {
    Page<Pokedex> findByNameContainingIgnoreCaseOrPromptContainingIgnoreCase(String name, String prompt, Pageable pageable);
}