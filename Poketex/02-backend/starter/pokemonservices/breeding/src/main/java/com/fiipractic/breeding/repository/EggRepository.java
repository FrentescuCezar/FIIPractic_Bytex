package com.fiipractic.breeding.repository;

import com.fiipractic.breeding.model.Egg;
import com.fiipractic.breeding.model.EggStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EggRepository extends JpaRepository<Egg, Integer> {
    public Egg findOneByPokemon1AndPokemon2AndStatus(Integer pokemon1, Integer pokemon2, EggStatus status);
    public List<Egg> findByStatus(EggStatus status);
}