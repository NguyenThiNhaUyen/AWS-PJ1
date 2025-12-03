package com.metro.metropolitano.controller;


import com.metro.metropolitano.dto.FareDTO;
import com.metro.metropolitano.service.FareService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fares")
@RequiredArgsConstructor
public class AdminFareController {

    private final FareService fareService;

    @GetMapping
    public List<FareDTO> getAllFares() {
        return fareService.getAllFares();
    }

    @PutMapping("/{id}")
    public FareDTO updateFare(@PathVariable Long id, @RequestBody FareDTO dto) {
        return fareService.updateFare(id, dto);
    }

    @PostMapping
    public FareDTO createFare(@RequestBody FareDTO dto) {
        return fareService.createFare(dto);
    }
}
