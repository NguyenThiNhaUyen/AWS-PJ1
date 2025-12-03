package com.metro.metropolitano.service;


import com.metro.metropolitano.dto.FareDTO;
import com.metro.metropolitano.model.FareRule;
import com.metro.metropolitano.model.Station;
import com.metro.metropolitano.repository.FareRuleRepository;
import com.metro.metropolitano.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public List<FareDTO> getAllFares() {
        return fareRuleRepository.findAll().stream()
                .map(f -> FareDTO.builder()
                        .id(f.getId())
                        .name(f.getName())
                        .description(f.getStartStation().getName() + " → " + f.getEndStation().getName())
                        .price(f.getPrice().longValue())
                        .isActive(true)
                        .build())
                .toList();
    }

    public FareDTO updateFare(Long id, FareDTO dto) {
        FareRule fare = fareRuleRepository.findById(id).orElseThrow();
        fare.setPrice((double) dto.getPrice());
        fare.setName(dto.getName());
        fareRuleRepository.save(fare);
        return dto;
    }

    public FareDTO createFare(FareDTO dto) {
        FareRule fare = new FareRule();
        fare.setPrice((double) dto.getPrice());
        fare.setName(dto.getName());
        fareRuleRepository.save(fare);
        dto.setId(fare.getId());
        return dto;
    }
}
