package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.AdminSummaryDto;
import com.metro.metropolitano.dto.DailyRevenueDto;
import com.metro.metropolitano.dto.TopRouteDto;
import com.metro.metropolitano.repository.AccountRepository;
import com.metro.metropolitano.repository.PaymentRepository;
import com.metro.metropolitano.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AccountRepository accountRepository;

    public AdminSummaryDto getSummary() {
        long totalTickets = ticketRepository.count();
        long totalPaidTickets = ticketRepository.countPaidTickets();
        double totalRevenue = paymentRepository.getTotalRevenue();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);

        double todayRevenue = paymentRepository.getRevenueBetween(startOfDay, endOfDay);
        long todayTickets = paymentRepository.countPaidTicketsBetween(startOfDay, endOfDay);

        long totalAccounts = accountRepository.count();

        return new AdminSummaryDto(
                totalTickets,
                totalPaidTickets,
                totalRevenue,
                todayTickets,
                todayRevenue,
                totalAccounts
        );
    }

    public List<DailyRevenueDto> getRevenueLastDays(int days) {
        List<DailyRevenueDto> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = days - 1; i>= 0; i--){
            LocalDate date = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay().minusNanos(1);

            double revenue = paymentRepository.getRevenueBetween(start, end);
            long ticket = paymentRepository.countPaidTicketsBetween(start, end);

            result.add(new DailyRevenueDto(date, revenue, ticket));
        }
        return result;
    }

    public List<TopRouteDto> getTopRoutes(int limit){
        List<Object[]> raw = ticketRepository.findTopRoutesRaw();
        List<TopRouteDto> result = new ArrayList<>();

        for (int i = 0; i < raw.size() && i < limit; i++){
            Object[] row = raw.get(i);
            String start = (String) row[0];
            String end = (String) row[1];
            long count = (long) row[2];

            result.add(new TopRouteDto(start, end, count));
        }
        return result;
    }
}
