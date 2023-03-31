package com.fiipractic.stablediffusion.repository;

import com.fiipractic.pokemoncatalog.model.Pokedex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StableDiffusionRepository extends JpaRepository<Pokedex, Integer> {



}