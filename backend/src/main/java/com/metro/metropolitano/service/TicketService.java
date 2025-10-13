package com.metro.metropolitano.service;


import com.metro.metropolitano.model.*;
import com.metro.metropolitano.repository.PaymentRepository;
import com.metro.metropolitano.repository.StationRepository;
import com.metro.metropolitano.repository.TicketRepository;
import com.metro.metropolitano.repository.TicketTypeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private FareService fareService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    public Ticket purchaseRouteTicket(Account account, String startName, String endName,
                                 String ticketTypeName, String paymentMethod) {
        TicketType type = ticketTypeRepository.findByName(ticketTypeName)
                .orElseThrow(() -> new RuntimeException("Ticket type not found: " + ticketTypeName));

        Ticket t = new Ticket();
        t.setTicketCode(UUID.randomUUID().toString());
        t.setAccount(account);
        t.setTicketType(type);
        t.setStatus("NOT_ACTIVATED");
        t.setActivationTime(null);
        t.setExpirationTime(null);

        double price;


        if (ticketTypeName.equalsIgnoreCase("Ve tuyen")) {

            Station start = stationRepository.findByName(startName)
                    .orElseThrow(() -> new RuntimeException("Start station not found"));
            Station end = stationRepository.findByName(endName)
                    .orElseThrow(() -> new RuntimeException("End station not found"));

            price = fareService.calculateFare(startName, endName);

            t.setStartStation(start);
            t.setEndStation(end);
            t.setPrice(price);
            t.setExpirationTime(null);

        } else if (ticketTypeName.equalsIgnoreCase("Ve 1 ngay")) {
            price = 40000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusDays(1));

        } else if (ticketTypeName.equalsIgnoreCase("Ve 3 ngay")) {
            price = 90000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusDays(3));

        } else if (ticketTypeName.equalsIgnoreCase("Ve thang")) {
            price = 300000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusMonths(1));

        } else if (ticketTypeName.equalsIgnoreCase("Ve thang HSSV")) {
            price = 150000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusMonths(1));

        } else {
            throw new RuntimeException("Unsupported ticket type: " + ticketTypeName);
        }


        ticketRepository.save(t);


        Payment payment = new Payment();
        payment.setAmount(price);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentTime(LocalDateTime.now());
        payment.setTicket(t);
        paymentRepository.save(payment);

        return t;
    }

    @Transactional
    public Ticket activateTicket(String ticketCode, String atStationName) {
        Ticket t = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if ("ACTIVATED".equals(t.getStatus())) {

            return t;
        }

        if (!"NOT_ACTIVATED".equals(t.getStatus())) {
            throw new RuntimeException("Ticket already used or expired");
        }

        LocalDateTime now = LocalDateTime.now();
        t.setActivationTime(now);

        String normalizedType = normalize(t.getTicketType().getName());
        LocalDateTime expiration;

        switch (normalizedType) {
            case "ve tuyen":
                expiration = now.plusHours(2);
                break;
            case "ve 1 ngay":
                expiration = now.plusDays(1);
                break;
            case "ve 3 ngay":
                expiration = now.plusDays(3);
                break;
            case "ve thang":
            case "ve thang hssv":
                expiration = now.plusMonths(1);
                break;
            default:
                throw new RuntimeException("Unsupported ticket type for activation: " + t.getTicketType().getName());
        }

        t.setExpirationTime(expiration);
        t.setStatus("ACTIVATED");
        return ticketRepository.save(t);
    }

    @Transactional
    public Ticket scanAtDestination(String ticketCode, String atStationName) {
        Ticket t = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!"ACTIVATED".equals(t.getStatus())) {
            throw new RuntimeException("Ticket not activated");
        }


        if (t.getExpirationTime() != null && LocalDateTime.now().isAfter(t.getExpirationTime())) {
            t.setStatus("EXPIRED");
            ticketRepository.save(t);
            throw new RuntimeException("Ticket has expired");
        }


        String normalizedType = normalize(t.getTicketType().getName());

        switch (normalizedType) {
            case "ve tuyen":

                if (t.getEndStation() != null && !t.getEndStation().getName().equals(atStationName)) {
                    throw new RuntimeException("Wrong destination station");
                }
                t.setStatus("USED");
                ticketRepository.save(t);
                break;

            case "ve 1 ngay":
            case "ve 3 ngay":
            case "ve thang":
            case "ve thang hssv":

                System.out.println("Ticket still valid, reused within period.");
                break;

            default:
                throw new RuntimeException("Unsupported ticket type for scan: " + t.getTicketType().getName());
        }

        return t;
    }

    private String normalize(String input) {
        if (input == null) return "";
        String noAccent = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return noAccent.toLowerCase().trim();
    }
}
