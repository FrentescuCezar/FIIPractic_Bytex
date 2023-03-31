package com.fiipractic.pokemoncatalog.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
@ToString
public class Pokedex {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

