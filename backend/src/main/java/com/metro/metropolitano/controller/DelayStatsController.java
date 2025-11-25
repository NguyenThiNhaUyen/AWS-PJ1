package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.LineDelayStatsDto;
import com.metro.metropolitano.dto.StationDelayStatsDto;
import com.metro.metropolitano.service.DelayStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/delays")
@RequiredArgsConstructor
public class DelayStatsController {

    private final DelayStatsService delayStatsService;

    /**
     * GET /api/admin/delays/line?line=Line%201&from=2025-11-01&to=2025-11-30
     */
    @GetMapping("/line")
    public ResponseEntity<LineDelayStatsDto> lineStats(
            @RequestParam String line,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(delayStatsService.lineDelayStats(line, from, to));
    }

    /**
     * GET /api/admin/delays/station?station=Ba%20Son&from=2025-11-01&to=2025-11-30
     */
    @GetMapping("/station")
    public ResponseEntity<StationDelayStatsDto> stationStats(
            @RequestParam String station,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(delayStatsService.stationDelayStats(station, from, to));
    }
}
