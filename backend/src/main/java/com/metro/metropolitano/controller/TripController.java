package com.metro.metropolitano.controller;

import com.metro.metropolitano.model.Trip;
import com.metro.metropolitano.model.TripStop;
import com.metro.metropolitano.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;


    @GetMapping
    public ResponseEntity<?> getTrips(
            @RequestParam String line,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ){
        return ResponseEntity.ok(tripService.findTrips(line, date));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id){
        return ResponseEntity.ok(tripService.getTrip(id));
    }

    @GetMapping("/{id}/stops")
    public ResponseEntity<?> getStopById(@PathVariable Long id){
        return ResponseEntity.ok(tripService.getTripStops(id));
    }

//    /**
//     * Tìm danh sách chuyến theo line + ngày
//     * GET /api/trips/search?line=Line%201&date=2025-11-21
//     */
//    @GetMapping("/search")
//    public ResponseEntity<?> searchTrips(
//            @RequestParam String line,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
//    ) {
//        List<Trip> trips = tripService.findTrips(line, date);
//
//        // Có thể map sang DTO, ở đây trả đơn giản
//        return ResponseEntity.ok(trips);
//    }
//
//    /**
//     * Lịch trình chi tiết của 1 chuyến
//     * GET /api/trips/{id}/stops
//     */
//    @GetMapping("/{id}/stops")
//    public ResponseEntity<?> getTripStops(@PathVariable Long id) {
//        List<TripStop> stops = tripService.getTripStops(id);
//        return ResponseEntity.ok(stops);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getTrip(@PathVariable Long id) {
//        return tripService.findTrips(id);
//    }
}
