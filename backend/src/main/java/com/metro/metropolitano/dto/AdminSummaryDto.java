package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminSummaryDto {
    private long totalTickets;
    private long totalPaidTickets;
    private double totalRevenue;    //doanh thu all time

    private long todayTickets;
    private double todayRevenue;

    private long totalAccounts;

}
