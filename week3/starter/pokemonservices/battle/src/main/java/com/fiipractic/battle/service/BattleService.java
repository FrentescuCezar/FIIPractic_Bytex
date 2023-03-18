package com.fiipractic.battle.service;

import com.fiipractic.pokemoncatalog.model.Pokedex;
import com.fiipractic.pokemoncatalog.model.Pokemon;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class BattleService {
    public String battle(Model model){
        List<Pokemon> team1 = this.getTeam(5);
        List<Pokemon> team2 = this.getTeam(5);

        int team1BaseTotal = team1.stream().mapToInt(Pokemon::getBaseTotal).sum();
        int team2BaseTotal = team2.stream().mapToInt(Pokemon::getBaseTotal).sum();


//        List<Pokemon> team1;
//        List<Pokemon> team2;
//        int team1BaseTotal;
//        int team2BaseTotal;

//        do{
//            team1 = this.getTeam(5);
//            team2 = this.getTeam(5);
//
//            team1BaseTotal = team1.stream().mapToInt(Pokemon::getBaseTotal).sum();
//            team2BaseTotal = team2.stream().mapToInt(Pokemon::getBaseTotal).sum();
//        }while(team1BaseTotal!=team2BaseTotal);


        String result;
        if (team1BaseTotal > team2BaseTotal) {
            result = "Team 1 wins!";
        } else if (team1BaseTotal < team2BaseTotal) {
            result = "Team 2 wins!";
        } else {
            result = "0.00000000000001%";
        }

        String scores = "Team 1 score: " + team1BaseTotal + ", Team 2 score: " + team2BaseTotal;

        model.addAttribute("team1",team1);
        model.addAttribute("team2",team2);
        model.addAttribute("result", result);
        model.addAttribute("scores", scores);


        return "battle";
    }

    private List<Pokemon> getTeam(Integer teamSize){
        RestTemplate restTemplate = new RestTemplate();

        Pokemon[] response = restTemplate.getForObject(
                "http://localhost:8081/pokedex/random?limit=" + teamSize,
                Pokemon[].class);

        List<Pokemon> team = Arrays.stream(response).toList();

        return team;
    }
}
