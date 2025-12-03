package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.AdminTicketDTO;
import com.metro.metropolitano.model.Ticket;
import com.metro.metropolitano.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminTicketService {
    private final TicketRepository ticketRepository;

    public Page<AdminTicketDTO> getAll(String search, int page, int size) {
        Page<Ticket> tickets = ticketRepository.searchTickets(
                search == null ? null : search.trim(),
                PageRequest.of(page, size, Sort.by("id").descending())
        );

        return tickets.map(t -> AdminTicketDTO.builder()
                .id(t.getId())
                .username(t.getAccount().getUsername())
                .fullname(t.getAccount().getFullName())
                .route(t.getStartStation().getName() + " → " + t.getEndStation().getName())
                .ticketType(t.getTicketType().getName())
                .price(t.getPrice())
                .status(t.getStatus())
                .purchaseDate(t.getActivationTime())
                .build()
        );
    }

    public AdminTicketDTO getOne(Long id) {
        Ticket t = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        return AdminTicketDTO.builder()
                .id(t.getId())
                .username(t.getAccount().getUsername())
                .fullname(t.getAccount().getFullName())
                .route(t.getStartStation().getName() + " → " + t.getEndStation().getName())
                .ticketType(t.getTicketType().getName())
                .price(t.getPrice())
                .status(t.getStatus())
                .purchaseDate(t.getActivationTime())
                .build();
    }

    public void cancel(Long id) {
        Ticket t = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        t.setStatus("CANCELLED");
        ticketRepository.save(t);
    }
}
