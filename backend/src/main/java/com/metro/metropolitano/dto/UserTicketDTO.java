package com.metro.metropolitano.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data

@NoArgsConstructor
public class UserTicketDTO {
    private Long id;
    private String route;
    private Double price;
    private String status;
    private LocalDateTime purchaseDate; // giữ LocalDateTime
    private String purchaseDateStr;


    public UserTicketDTO(Long id, String route, Double price, String status, LocalDateTime purchaseDate) {
        this.id = id;
        this.route = route;
        this.price = price;
        this.status = status;
        this.purchaseDate = purchaseDate;
    }// dùng để hiển thị

}
