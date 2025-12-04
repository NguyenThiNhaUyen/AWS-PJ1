package com.metro.metropolitano.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.metro.metropolitano.model.Account;
import com.metro.metropolitano.model.Provider;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    @Query("SELECT a FROM Account a WHERE a.username = :u OR a.email = :u")
    Optional<Account> findByUsernameOrEmail(@Param("u") String usernameOrEmail);

    Optional<Account> findByUsername(String username);

    Optional<Account> findByEmail(String email);

    Optional<Account> findByProviderAndProviderId(Provider provider, String providerId);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("""
        SELECT a FROM Account a
        WHERE (:search IS NULL
               OR LOWER(a.username) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Account> search(@Param("search") String search, Pageable pageable);
}
