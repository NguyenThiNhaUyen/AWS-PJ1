package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FareResponse {
    private String startStation;
    private String endStation;
    private double price;
}
