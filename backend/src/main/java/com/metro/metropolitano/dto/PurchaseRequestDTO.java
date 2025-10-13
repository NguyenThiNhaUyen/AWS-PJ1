package com.metro.metropolitano.dto;

import lombok.Data;

@Data
public class PurchaseRequestDTO {
    private Long accountId;
    private String startStation;
    private String endStation;
    private String paymentMethod;
    private String ticketTypeName;
}
