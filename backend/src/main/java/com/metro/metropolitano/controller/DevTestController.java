package com.metro.metropolitano.controller;

import com.metro.metropolitano.model.Payment;
import com.metro.metropolitano.repository.TicketRepository;
import com.metro.metropolitano.repository.TripRepository;
import com.metro.metropolitano.repository.TripStopRepository;
import com.metro.metropolitano.service.PaymentService;
import com.metro.metropolitano.service.VNPayService;
import com.metro.metropolitano.utils.TripSeeder;
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
    private final TripRepository tripRepository;
    private final TripStopRepository tripStopRepository;
    private final TripSeeder tripSeeder;

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

        Map<String, String> sorted = new TreeMap<>(params);
        String data = vnPayService.buildQuery(sorted);
        return vnPayService.hmacSHA512("7MUW6K20MIXQKEFYPKX892UJ3ELSD40Z", data);
    }

    @PostMapping("/reseed-trips")
    public Map<String, Object> reseedTrips() {
        // Xóa tất cả trips và trip_stops
        tripStopRepository.deleteAll();
        tripRepository.deleteAll();

        // Chạy lại seeder
        try {
            tripSeeder.run();
            long count = tripRepository.count();
            return Map.of(
                    "success", true,
                    "message", "Trips reseeded successfully",
                    "totalTrips", count
            );
        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "message", "Failed to reseed: " + e.getMessage()
            );
        }
    }

}
