package com.metro.metropolitano.controller;


import com.metro.metropolitano.dto.ScheduleDTO;
import com.metro.metropolitano.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("/upcoming")
    public List<ScheduleDTO> getUpcomingSchedules(@RequestParam(defaultValue = "6") int limit) {
        return scheduleService.getUpcomingSchedules(limit);
    }

    @GetMapping("/line/{lineName}")
    public List<ScheduleDTO> getSchedulesByLine(@PathVariable String lineName) {
        return scheduleService.getSchedulesByLine(lineName);
    }
}
