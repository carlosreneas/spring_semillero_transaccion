package com.example.demo.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager manager;
    private final JwtService jwt;

    public AuthService(AuthenticationManager manager, JwtService jwt) {
        this.manager = manager;
        this.jwt = jwt;
    }

    public LoginResponse login(LoginRequest request) {
        var auth = manager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        return new LoginResponse(jwt.generar(auth), "Bearer", jwt.segundosDeVida());
    }
}

