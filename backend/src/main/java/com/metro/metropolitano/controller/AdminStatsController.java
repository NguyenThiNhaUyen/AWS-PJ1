package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.AdminSummaryDto;
import com.metro.metropolitano.dto.DailyRevenueDto;
import com.metro.metropolitano.dto.TopRouteDto;
import com.metro.metropolitano.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('Admin')")
public class AdminStatsController {

    @Autowired
    private AdminStatsService statsService;

    @GetMapping("/summary")
    public ResponseEntity<AdminSummaryDto> getSummary() {
        return ResponseEntity.ok(statsService.getSummary());
    }

    @GetMapping("/revenue-by-day")
    public ResponseEntity<List<DailyRevenueDto>> revenueByDay(
            @RequestParam(defaultValue = "7") int days
    ) {
        return ResponseEntity.ok(statsService.getRevenueLastDays(days));
    }

    @GetMapping("/top-routes")
    public ResponseEntity<List<TopRouteDto>> topRoutes(
            @RequestParam(defaultValue = "5") int limit
    ){
        return ResponseEntity.ok(statsService.getTopRoutes(limit));
    }
}
