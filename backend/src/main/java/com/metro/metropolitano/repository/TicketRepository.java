package com.metro.metropolitano.repository;

import com.metro.metropolitano.dto.UserStatsDTO;
import com.metro.metropolitano.dto.UserTicketDTO;
import com.metro.metropolitano.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    Optional<Ticket> findByTicketCode(String code);

    List<Ticket> findByAccount_IdOrderByIdDesc(Long accountId);


    List<Ticket> findByAccount_UsernameOrderByIdDesc(String username);

    //Số vé đã thanh toán
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status <> 'PENDING'")
    long countPaidTickets();

    // Top tuyến được đi nhiều nhất (dựa trên vé đã thanh toán)
    @Query("""
        SELECT t.startStation.name, t.endStation.name, COUNT(t)
        FROM Ticket t
        WHERE t.status IN ('PENDING', 'PAID', 'ACTIVATED', 'USED')
        GROUP BY t.startStation.name, t.endStation.name
        ORDER BY COUNT(t) DESC 
    """)
    List<Object[]> findTopRoutesRaw();


    @Query("""
    SELECT new com.metro.metropolitano.dto.UserStatsDTO(
        COUNT(t),
        SUM(CASE WHEN t.status = 'ACTIVE' THEN 1L ELSE 0L END),
        SUM(CASE WHEN t.status = 'USED' THEN 1L ELSE 0L END),
        SUM(t.price)
    )
    FROM Ticket t
    WHERE t.account.id = :accountId
""")
    UserStatsDTO getUserStats(@Param("accountId") Long accountId);

    @Query("""
    SELECT new com.metro.metropolitano.dto.UserTicketDTO(
                    t.id,
                    CONCAT(t.startStation.name, ' → ', t.endStation.name),
                    t.price,
                    t.status,
                    t.activationTime
                )
                FROM Ticket t
                WHERE t.account.id = :accountId
                ORDER BY t.activationTime DESC
""")
    List<UserTicketDTO> getRecentTickets(@Param("accountId") Long accountId);


    @Query("""
        SELECT t FROM Ticket t
        JOIN t.account a
        JOIN t.startStation s1
        JOIN t.endStation s2
        WHERE (:search IS NULL 
               OR LOWER(a.username) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(a.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR CAST(t.id AS string) LIKE %:search%)
        """)
    Page<Ticket> searchTickets(@Param("search") String search, Pageable pageable);

    List<Ticket> findByStartStation_LineName(String lineName);
}
