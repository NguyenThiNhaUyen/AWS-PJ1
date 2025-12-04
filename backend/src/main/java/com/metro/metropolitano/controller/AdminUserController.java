package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.AdminUserDTO;
import com.metro.metropolitano.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService service;

    @GetMapping
    public Page<AdminUserDTO> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        return service.getAll(search, page, size);
    }

    @GetMapping("/{id}")
    public AdminUserDTO getUserDetails(@PathVariable Long id) {
        return service.getOne(id);
    }

    @PostMapping
    public AdminUserDTO createUser(@RequestBody AdminUserDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public AdminUserDTO updateUser(
            @PathVariable Long id,
            @RequestBody AdminUserDTO dto
    ) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}/toggle-status")
    public void toggleUserStatus(@PathVariable Long id) {
        service.toggleStatus(id);
    }
}
