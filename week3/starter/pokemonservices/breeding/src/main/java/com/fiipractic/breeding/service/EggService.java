package com.fiipractic.breeding.service;

import com.fiipractic.breeding.model.Egg;
import com.fiipractic.breeding.model.EggStatus;
import com.fiipractic.breeding.repository.EggRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EggService {
    //private final EggRepository eggRepository;
//
    //public EggService(EggRepository eggRepository) {
    //    this.eggRepository = eggRepository;
    //}
//
    //@Scheduled(fixedRate = 1000)
    //public void scanEggs() {
    //    System.out.println("Scanning eggs");
    //    List<Egg> pendingEggs = eggRepository.findByStatus(EggStatus.PENDING);
    //    for (Egg egg : pendingEggs) {
    //        if (egg.getHatchTime().isBefore(LocalDateTime.now())) {
    //            egg.setStatus(EggStatus.HATCHED);
    //            eggRepository.save(egg);
    //        }
    //    }
    //}




}
