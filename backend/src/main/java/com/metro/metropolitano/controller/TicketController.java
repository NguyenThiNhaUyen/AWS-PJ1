package com.metro.metropolitano.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.metro.metropolitano.dto.PurchaseRequestDTO;
import com.metro.metropolitano.dto.TicketSummaryDTO;
import com.metro.metropolitano.enums.TicketPriceEnum;
import com.metro.metropolitano.model.Account;
import com.metro.metropolitano.model.Ticket;
import com.metro.metropolitano.repository.AccountRepository;
import com.metro.metropolitano.repository.TicketRepository;
import com.metro.metropolitano.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketService ticketService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @PostMapping("/activate")
    public ResponseEntity<Map<String, Object>> activateTicket(@RequestParam Long ticketId){
        Ticket t = ticketService.activateTicketById(ticketId);

        return ResponseEntity.ok(Map.of(
                "ticketId", t.getId(),
                "activationTime", t.getActivationTime(),
                "expirationTime", t.getExpirationTime(),
                "status", t.getStatus()
        ));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketSummaryDTO>> getMyTickets(@RequestParam Long accountId) {

        List<Ticket> tickets = ticketService.getTicketsForAccount(accountId);

        List<TicketSummaryDTO> dtos = tickets.stream()
                .map(t -> new TicketSummaryDTO(
                        t.getId(),
                        t.getTicketType() != null ? t.getTicketType().getName() : null,
                        t.getStartStation() != null ? t.getStartStation().getName() : null,
                        t.getEndStation() != null ? t.getEndStation().getName() : null,
                        t.getPrice(),
                        t.getStatus(),
                        t.getActivationTime(),
                        t.getExpirationTime()
                ))
                .toList();

        return ResponseEntity.ok(dtos);
    }

//    @GetMapping("/my")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<List<TicketSummaryDTO>> getMyTickets(Authentication authentication) {
//        String username = authentication.getName();
//
//        List<Ticket> tickets = ticketService.getTicketsForUser(username);
//
//        List<TicketSummaryDTO> dtos = tickets.stream()
//                .map(t -> new TicketSummaryDTO(
//                        t.getId(),
//                        t.getTicketType() != null ? t.getTicketType().getName() : null,
//                        t.getStartStation() != null ? t.getStartStation().getName() : null,
//                        t.getEndStation() != null ? t.getEndStation().getName() : null,
//                        t.getPrice(),
//                        t.getStatus(),
//                        t.getActivationTime(),
//                        t.getExpirationTime()
//                ))
//                .collect(Collectors.toList());
//        return  ResponseEntity.ok(dtos);
//    }

    @PostMapping("/purchase-route")
    public ResponseEntity<?> purchaseRoute(@RequestBody PurchaseRequestDTO dto){
        Account acc=accountRepository.findById(dto.getAccountId()).orElseThrow(()->new RuntimeException("Account not found"));
        Ticket t=ticketService.purchaseRouteTicket(acc,dto.getStartStation(),dto.getEndStation(),dto.getTicketTypeName(),dto.getPaymentMethod());
        return ResponseEntity.ok(t);
    }

    @PostMapping("/activate/{ticketCode}")
    public ResponseEntity<?> activate(@PathVariable(name = "ticketCode")String ticketCode,@RequestParam String station){
        Ticket t=ticketService.activateTicket(ticketCode,station);
        return ResponseEntity.ok(t);
    }

    @PostMapping("/scan-destination/{ticketCode}")
    public ResponseEntity<?> scanDest(@PathVariable(name = "ticketCode") String ticketCode,@RequestParam String station){
        Ticket t=ticketService.scanAtDestination(ticketCode,station);
        return ResponseEntity.ok(t);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id){
        return ticketRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ticket-prices")
    public Map<String, int[]> getTicketPrices() {
        Map<String, int[]> prices = new HashMap<>();
        for (TicketPriceEnum station : TicketPriceEnum.values()) {
            prices.put(station.name(), station.getPrices());
        }
        return prices;
    }
}
