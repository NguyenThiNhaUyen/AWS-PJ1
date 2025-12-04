package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.RouteStatsDTO;
import com.metro.metropolitano.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/admin/routes")
@RequiredArgsConstructor
public class AdminRouteController {

    private final RouteService routeService;

    @GetMapping("/stats")
    public List<RouteStatsDTO> getAllRoutesWithStats() {
        return routeService.getAllRoutesWithStats();
    }
}
