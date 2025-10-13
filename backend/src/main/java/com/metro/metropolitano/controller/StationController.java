package com.metro.metropolitano.controller;


import com.metro.metropolitano.model.Station;
import com.metro.metropolitano.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    @Autowired
    private StationRepository stationRepository;

    @GetMapping
    public List<Station> all(){
        return stationRepository.findAll();
    }
}
