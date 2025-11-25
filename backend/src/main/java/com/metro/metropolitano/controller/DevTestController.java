package com.metro.metropolitano.controller;

import com.metro.metropolitano.model.Payment;
import com.metro.metropolitano.repository.TicketRepository;
import com.metro.metropolitano.service.PaymentService;
import com.metro.metropolitano.service.VNPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
public class DevTestController {

    private final PaymentService paymentService;
    private final TicketRepository ticketRepository;
    private final VNPayService vnPayService;

    @PostMapping("/payment-test")
    public Payment createTestPayment(
            @RequestParam Long ticketId,
            @RequestParam double amountVnd
    ) {
        var ticket = ticketRepository.findById(ticketId).orElseThrow();
        return paymentService.createOrUpdatePending(ticket, amountVnd);
    }

    @GetMapping("/vnpay-sign")
    public String signIpn(@RequestParam Map<String, String> params) {
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String,String> sorted = new TreeMap<>(params);
        String data = vnPayService.buildQuery(sorted);   // nếu private thì chuyển thành public
        return vnPayService.hmacSHA512("7MUW6K20MIXQKEFYPKX892UJ3ELSD40Z", data);
    }

}
