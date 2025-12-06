package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTicketDTO {
    private Long id;
    private String routeName;
    private Double price;
    private String status;

    private LocalDateTime activationTime; // thêm để đúng JPQL
    private LocalDateTime purchaseDate;

    private String purchaseDateStr;


    public UserTicketDTO(Long id, String routeName, Double price, String status, LocalDateTime activationTime) {
        this.id = id;
        this.routeName = routeName;
        this.price = price;
        this.status = status;
        this.activationTime = activationTime;
    }
}
