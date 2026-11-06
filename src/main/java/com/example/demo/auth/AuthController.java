package com.example.demo.auth;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;
    public AuthController(AuthService service) { this.service = service; }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }

    @GetMapping("/yo")
    public Map<String, Object> yo(Authentication auth) {
        return Map.of(
            "email", auth.getName(),
            "autoridades", auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());
    }
}

