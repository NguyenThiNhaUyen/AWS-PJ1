package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    Optional<Ticket> findByTicketCode(String code);
}
