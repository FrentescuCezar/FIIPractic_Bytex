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
public class Pokedex {
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
    private String seed;
    private String prompt;
    private Integer steps;
    private Integer generation;
    private List<String> abilities;
    private String type1;
    private String type2;
    private Integer hp;
    private Double attack;
    private Double spAttack;
    private Double defense;
    private Double spDefense;
    private Double speed;
    private Integer baseTotal;
    private Integer baseEggSteps;
    private Integer experienceGrowth;
}

