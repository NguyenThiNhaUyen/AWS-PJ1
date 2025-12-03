package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FareDTO {
    private Long id;
    private String name;
    private String description;
    private long price;
    private boolean isActive;
}
