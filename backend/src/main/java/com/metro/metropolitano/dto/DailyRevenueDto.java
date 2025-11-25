package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyRevenueDto {
    private LocalDate date;
    private double revenue;
    private long tickets;
}
