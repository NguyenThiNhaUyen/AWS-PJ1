package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.AdminTripMonitorDto;
import com.metro.metropolitano.enums.TripStatus;
import com.metro.metropolitano.service.AdminTripMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/trips")
@RequiredArgsConstructor
public class AdminTripController {

    private final AdminTripMonitoringService monitoringService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Monitoring trips:
     * GET /api/admin/trips/monitor?line=Line%201&date=2025-11-21&status=RUNNING,DELAYED,ISSUE
     */
    @GetMapping("/monitor")
    public ResponseEntity<List<AdminTripMonitorDto>> monitor(
            @RequestParam String line,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status
    ) {
        List<TripStatus> statuses = null;

        if (status != null && !status.isBlank()) {
            statuses = Arrays.stream(status.split(","))
                    .map(String::trim)
                    .map(TripStatus::valueOf)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                monitoringService.monitorTrips(line, date, statuses)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminTripMonitorDto> changeStatus(
            @PathVariable Long id,
            @RequestParam TripStatus status
    ) {
        return ResponseEntity.ok(
                monitoringService.updateTripStatus(id, status)
        );
    }

}
