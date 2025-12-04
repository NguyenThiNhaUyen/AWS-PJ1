package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.AdminTicketDTO;
import com.metro.metropolitano.service.AdminTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tickets")
@RequiredArgsConstructor
public class AdminTicketController {
    private final AdminTicketService adminTicketService;

    @GetMapping
    public Page<AdminTicketDTO> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        return adminTicketService.getAll(search, page, size);
    }

    @GetMapping("/{id}")
    public AdminTicketDTO getTicketDetails(@PathVariable Long id) {
        return adminTicketService.getOne(id);
    }

    @DeleteMapping("/{id}")
    public void cancelTicket(@PathVariable Long id) {
        adminTicketService.cancel(id);
    }
}
