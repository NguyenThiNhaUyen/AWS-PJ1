package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.AdminUserDTO;
import com.metro.metropolitano.model.Account;
import com.metro.metropolitano.model.Role;
import com.metro.metropolitano.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<AdminUserDTO> getAll(String search, int page, int size) {

        Page<Account> users = accountRepository.search(
                search == null ? null : search.trim(),
                PageRequest.of(page, size, Sort.by("id").descending())
        );

        return users.map(this::convertToDTO);
    }

    public AdminUserDTO getOne(Long id) {
        Account a = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(a);
    }

    public AdminUserDTO create(AdminUserDTO dto) {

        if (accountRepository.existsByUsername(dto.getUsername()))
            throw new RuntimeException("Username already used");

        if (accountRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already used");

        Account a = new Account();
        a.setUsername(dto.getUsername());
        a.setEmail(dto.getEmail());
        a.setFullName(dto.getFullName());
        a.setPassword(passwordEncoder.encode("123456"));  // default password
        a.setRole(Role.valueOf(dto.getRole()));
        a.setIsActive(true);

        accountRepository.save(a);
        return convertToDTO(a);
    }

    public AdminUserDTO update(Long id, AdminUserDTO dto) {
        Account a = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        a.setFullName(dto.getFullName());
        a.setEmail(dto.getEmail());
        a.setRole(Role.valueOf(dto.getRole()));

        accountRepository.save(a);
        return convertToDTO(a);
    }

    public void toggleStatus(Long id) {
        Account a = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        a.setIsActive(!a.getIsActive());
        accountRepository.save(a);
    }

    private AdminUserDTO convertToDTO(Account a) {
        return AdminUserDTO.builder()
                .id(a.getId())
                .username(a.getUsername())
                .email(a.getEmail())
                .fullName(a.getFullName())
                .role(a.getRole().toString())
                .status(a.getIsActive() ? "Active" : "Locked")
                .createdAt(a.getCreatedAt())
                .build();
    }
}
