package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.UserStatsDTO;
import com.metro.metropolitano.dto.UserTicketDTO;
import com.metro.metropolitano.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/stats")
@RequiredArgsConstructor
public class UserStatsController {
    private final UserStatsService userStatsService;

    @GetMapping("/summary")
    public UserStatsDTO getSummary(@RequestParam Long accountId) {
        return userStatsService.getStats(accountId);
    }

    @GetMapping("/recent-tickets")
    public List<UserTicketDTO> getRecentTickets(
            @RequestParam Long accountId,
            @RequestParam(defaultValue = "3") int limit
    ) {
        return userStatsService.getRecentTickets(accountId, limit);
    }
}
