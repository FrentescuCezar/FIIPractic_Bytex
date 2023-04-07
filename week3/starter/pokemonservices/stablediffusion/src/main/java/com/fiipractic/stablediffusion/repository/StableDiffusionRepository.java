package com.fiipractic.stablediffusion.repository;

import com.fiipractic.pokemoncatalog.model.Poketex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@Repository
public interface StableDiffusionRepository extends JpaRepository<Poketex, Integer>, JpaSpecificationExecutor<Poketex> {
}