package com.metro.metropolitano.controller;


import com.metro.metropolitano.dto.PurchaseRequestDTO;
import com.metro.metropolitano.model.Account;
import com.metro.metropolitano.model.Ticket;
import com.metro.metropolitano.repository.AccountRepository;
import com.metro.metropolitano.repository.TicketRepository;
import com.metro.metropolitano.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketService ticketService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TicketRepository ticketRepository;

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
}
