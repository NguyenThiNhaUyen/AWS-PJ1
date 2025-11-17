package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.FareResponse;
import com.metro.metropolitano.service.FareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fares")
@RequiredArgsConstructor
public class FareController {

    private final FareService fareService;

    @GetMapping
    public ResponseEntity<FareResponse> calculateFare(
            @RequestParam String start,
            @RequestParam String end
    ){
        double price = fareService.calculateFare(start,end);
        FareResponse response = new FareResponse(start, end, price);
        return ResponseEntity.ok(response);
    }
}
