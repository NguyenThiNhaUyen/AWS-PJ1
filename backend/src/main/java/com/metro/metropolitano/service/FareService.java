package com.metro.metropolitano.service;


import com.metro.metropolitano.model.FareRule;
import com.metro.metropolitano.model.Station;
import com.metro.metropolitano.repository.FareRuleRepository;
import com.metro.metropolitano.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FareService {
    @Autowired
    private FareRuleRepository fareRuleRepository;

    @Autowired
    private StationRepository stationRepository;

    public double calculateFare(String startName,String endName){
        Station start=stationRepository.findByName(startName).orElseThrow(()->new RuntimeException("Start station not found"));

        Station end=stationRepository.findByName(endName).orElseThrow(()->new RuntimeException("End station not found"));

        Optional<FareRule> fr=fareRuleRepository.findByStartStationAndEndStation(start,end);
        return fr.map(FareRule::getPrice).orElseThrow(()->new RuntimeException("Fare not defined for this route"));
    }

}
