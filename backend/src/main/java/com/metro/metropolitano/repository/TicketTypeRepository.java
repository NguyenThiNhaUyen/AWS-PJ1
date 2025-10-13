package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType,Long> {
    Optional<TicketType> findByName(String name);
}
