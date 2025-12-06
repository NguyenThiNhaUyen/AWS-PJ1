package com.metro.metropolitano.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.metro.metropolitano.dto.StationArrivalDto;
import com.metro.metropolitano.service.TripService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationArrivalController {

    private final TripService tripService;

    /**
     * Lấy danh sách các chuyến metro sắp đến ga GET
     * /api/stations/{name}/arrivals?limit=10
     */
    @GetMapping("/{name}/arrivals")
    public ResponseEntity<List<StationArrivalDto>> getArrivals(
            @PathVariable String name,
            @RequestParam(defaultValue = "10") int limit) {
        List<StationArrivalDto> arrivals = tripService.getUpcomingArrivals(name, limit);
        return ResponseEntity.ok(arrivals);
    }
}
