package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.UserStatsDTO;
import com.metro.metropolitano.dto.UserTicketDTO;
import com.metro.metropolitano.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserStatsService {
    private final TicketRepository ticketRepository;

    public UserStatsDTO getStats(Long accountId) {
        UserStatsDTO stats = ticketRepository.getUserStats(accountId);

        if (stats == null) {
            return UserStatsDTO.builder()
                    .totalTickets(0)
                    .activeTickets(0)
                    .usedTickets(0)
                    .totalSpent(0.0)
                    .build();
        }

        return stats;
    }

    public List<UserTicketDTO> getRecentTickets(Long accountId, int limit) {
        List<UserTicketDTO> rawList = ticketRepository.getRecentTickets(accountId);

        DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return rawList.stream()
                .limit(limit)
                .map(t -> {
                    if (t.getPurchaseDate() != null) {
                        t.setPurchaseDateStr(t.getPurchaseDate().format(df)); // thêm trường String để hiển thị
                    } else {
                        t.setPurchaseDateStr("N/A");
                    }
                    return t;
                })
                .collect(Collectors.toList());
    }


}
