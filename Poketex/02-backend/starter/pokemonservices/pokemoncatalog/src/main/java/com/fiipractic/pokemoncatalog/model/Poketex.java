package com.fiipractic.pokemoncatalog.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Poketex {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;
    private String username;
    private String name;
    @Column(columnDefinition = "text")
    private String description;
    @Column(name = "image", columnDefinition = "text")
    private String image;
    private Long seed;
    @Column(columnDefinition = "text")
    private String prompt;
    @Column(columnDefinition = "text")
    private String negativePrompt;
    private Integer steps;
    private Integer generation;
    private Integer parent1;
    private Integer parent2;
    private List<String> abilities;
    private Integer hp;
    private Integer attack;
    @Column(columnDefinition = "sp_attack")
    private Integer spAttack;
    private Integer defense;
    @Column(columnDefinition = "sp_defense")
    private Integer spDefense;
    private Integer speed;
    @Column(columnDefinition = "base_total")
    private Integer baseTotal;
    @Column(columnDefinition = "base_egg_steps")
    private Integer baseEggSteps;
    @Column(columnDefinition = "experience_growth")
    private Integer experienceGrowth;

    public Poketex(String username, String name, String description, String image, Long seed, String prompt, String negativePrompt, Integer steps, Integer generation, List<String> abilities, Integer hp, Integer attack, Integer spAttack, Integer defense, Integer spDefense, Integer speed, Integer baseTotal, Integer baseEggSteps, Integer experienceGrowth) {
        this.username = username;
        this.name = name;
        this.description = description;
        this.image = image;
        this.seed = seed;
        this.prompt = prompt;
        this.negativePrompt = negativePrompt;
        this.steps = steps;
        this.generation = generation;
        this.abilities = abilities;
        this.hp = hp;
        this.attack = attack;
        this.spAttack = spAttack;
        this.defense = defense;
        this.spDefense = spDefense;
        this.speed = speed;
        this.baseTotal = baseTotal;
        this.baseEggSteps = baseEggSteps;
        this.experienceGrowth = experienceGrowth;
    }
}

