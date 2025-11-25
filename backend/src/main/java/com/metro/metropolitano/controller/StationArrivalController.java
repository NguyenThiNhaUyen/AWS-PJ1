package com.metro.metropolitano.controller;

import com.metro.metropolitano.model.TripStop;
import com.metro.metropolitano.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationArrivalController {

    private final TripService tripService;

    @GetMapping("/{name}/arrivals")
    public ResponseEntity<?> getArrivals(
            @PathVariable String name,
            @RequestParam(defaultValue = "5") int limit )
    {
        return ResponseEntity.ok(tripService.getUpcomingArrivalsAtStation(name, limit));
    }

    /**
     * Giờ tàu sắp đến 1 ga
     * GET /api/stations/{name}/arrivals?limit=5
     */
//    @GetMapping("/{name}/arrivals")
//    public ResponseEntity<?> getArrivals(
//            @PathVariable String name,
//            @RequestParam(defaultValue = "5") int limit
//    ) {
//        List<TripStop> stops = tripService.getUpcomingArrivalsAtStation(name, limit);
//
//        // Trả list rút gọn thông tin
//        var result = stops.stream().map(s -> Map.of(
//                "tripId", s.getTrip().getId(),
//                "lineName", s.getTrip().getLineName(),
//                "scheduledArrival", s.getScheduledArrival(),
//                "actualArrival", s.getActualArrival(),
//                "delayMinutes", s.getDelayMinutes(),
//                "station", s.getStation().getName(),
//                "status", s.getTrip().getStatus()
//        )).toList();
//
//        return ResponseEntity.ok(result);
//    }
}
