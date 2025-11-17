package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.RouteDto;
import com.metro.metropolitano.dto.TimetableDto;
import com.metro.metropolitano.model.Station;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class  RouteController {

    private final StationRepository stationRepository;
    private final TimetableService timetableService;

    @GetMapping
    public ResponseEntity<List<RouteDto>> getAllRoutes() {
        List<String> lineNames = stationRepository.findDistinctLineNames();

        List<RouteDto> routes = lineNames.stream()
                .map(line -> new RouteDto(
                        line,
                        stationRepository.findByLineNameOrderByOrderIndexAsc(line).size()
                ))
                .toList();

        return ResponseEntity.ok(routes);
    }

    @GetMapping("/{lineName}/stations")
    public ResponseEntity<List<Station>> getStationsByRoute(@PathVariable String lineName) {
        return ResponseEntity.ok(
                stationRepository.findByLineNameOrderByOrderIndexAsc(lineName)
        );
    }

    @GetMapping("/{lineName}/timetable")
    public ResponseEntity<TimetableDto> getTimetable(
            @PathVariable String lineName,
            @RequestParam(defaultValue = "weekday") String type
    ) {
        return ResponseEntity.ok(
                timetableService.getTimetable(lineName, type)
        );
    }
}
