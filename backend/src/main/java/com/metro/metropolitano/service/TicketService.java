package com.metro.metropolitano.service;


import com.metro.metropolitano.dto.PurchaseRequestDTO;
import com.metro.metropolitano.model.*;
import com.metro.metropolitano.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
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

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public Ticket activateTicketById(Long ticketId){
        Ticket t = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found " + ticketId));

        if("ACTIVATED".equalsIgnoreCase(t.getStatus()) || "ACTIVE".equalsIgnoreCase(t.getStatus())){
            return t;
        }

        if("USED".equalsIgnoreCase(t.getStatus()) || "EXPIRED".equalsIgnoreCase(t.getStatus())){
            throw new RuntimeException("Ticket already used or expired");
        }

        LocalDateTime now = LocalDateTime.now();
        t.setActivationTime(now);

        String normalizedType = normalize(t.getTicketType().getName());
        LocalDateTime expiration;

        switch(normalizedType){
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
        t.setStatus("ACTIVE");

        return ticketRepository.save(t);

    }

    @Transactional
    public List<Ticket> getTicketsForAccount(Long accountId) {
        return ticketRepository.findByAccount_IdOrderByIdDesc(accountId);
    }

    @Transactional
    public List<Ticket> getTicketsForUser(String username) {
        return ticketRepository.findByAccount_UsernameOrderByIdDesc(username);
    }

    @Transactional
    public Ticket createTicket(PurchaseRequestDTO request, double fare) {
        Account account = accountRepository.findById(request.getAccountId()).orElseThrow(() -> new RuntimeException("Account not found"));

        TicketType ticketType = ticketTypeRepository.findByName(request.getTicketTypeName()).orElseThrow(() -> new RuntimeException("Ticket type not found"));

        Station start = stationRepository.findByName(request.getStartStation()).orElseThrow(() -> new RuntimeException("Station not found"));

        Station end = stationRepository.findByName(request.getEndStation()).orElseThrow(() -> new RuntimeException("Station not found"));

        Ticket ticket = new Ticket();
        ticket.setAccount(account);
        ticket.setTicketType(ticketType);
        ticket.setStartStation(start);
        ticket.setEndStation(end);
        ticket.setPrice(fare);
        ticket.setStatus("PENDING");

        ticket.setActivationTime(null);
        ticket.setExpirationTime(null);
        return  ticketRepository.save(ticket);
    }

    @Transactional
    public Ticket purchaseRouteTicket(Account account, String startName, String endName,
                                      String ticketTypeName, String paymentMethod) {

        // Normalize chỉ để dùng trong if/else
        String normTicketType = normalize(ticketTypeName);

        // Lấy từ DB bằng tên gốc (đúng như đang seed)
        TicketType type = ticketTypeRepository.findByName(ticketTypeName)
                .orElseThrow(() -> new RuntimeException("Ticket type not found: " + ticketTypeName));

        Ticket t = new Ticket();
        t.setTicketCode(UUID.randomUUID().toString());
        t.setAccount(account);
        t.setTicketType(type);
        t.setStatus("NOT_ACTIVATED");

        double price;

        if (normTicketType.equals("ve tuyen")) {

            // station: cũng lấy bằng tên gốc
            Station start = stationRepository.findByName(startName)
                    .orElseThrow(() -> new RuntimeException("Start station not found"));
            Station end = stationRepository.findByName(endName)
                    .orElseThrow(() -> new RuntimeException("End station not found"));

            // tính giá, nên dùng tên/ID từ Station luôn cho chắc
            price = fareService.calculateFare(start.getName(), end.getName());

            t.setStartStation(start);
            t.setEndStation(end);
            t.setPrice(price);

        } else if (normTicketType.equals("ve 1 ngay")) {
            price = 40000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusDays(1));

        } else if (normTicketType.equals("ve 3 ngay")) {
            price = 90000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusDays(3));

        } else if (normTicketType.equals("ve thang")) {
            price = 300000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusMonths(1));

        } else if (normTicketType.equals("ve thang hssv")) {
            price = 150000;
            t.setPrice(price);
            t.setExpirationTime(LocalDateTime.now().plusMonths(1));

        } else {
            throw new RuntimeException("Unsupported ticket type: " + normTicketType);
        }

        ticketRepository.save(t);

        Payment p = new Payment();
        p.setAmount(price);
        p.setPaymentMethod(paymentMethod);
        p.setPaymentTime(LocalDateTime.now());
        p.setTicket(t);
        paymentRepository.save(p);

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
