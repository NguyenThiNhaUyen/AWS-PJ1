package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopRouteDto {
    private String startStation;
    private String endStation;
    private long count;
}
