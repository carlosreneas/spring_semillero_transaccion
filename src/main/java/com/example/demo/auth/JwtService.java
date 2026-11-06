package com.example.demo.auth;

import com.example.demo.seguridad.JwtConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class JwtService {
    private final JwtEncoder encoder;
    private final long minutos;

    public JwtService(JwtEncoder encoder, @Value("${app.jwt.expiration-minutes}") long minutos) {
        this.encoder = encoder;
        this.minutos = minutos;
    }

    public long segundosDeVida() { return minutos * 60; }

    public String generar(Authentication auth) {
        Instant ahora = Instant.now();
        List<String> roles = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .filter(a -> a.startsWith("ROLE_"))
            .map(a -> a.substring(5))
            .toList();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer(JwtConfig.EMISOR)
            .subject(auth.getName())
            .issuedAt(ahora)
            .expiresAt(ahora.plus(Duration.ofMinutes(minutos)))
            .claim("roles", roles)
            .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}

