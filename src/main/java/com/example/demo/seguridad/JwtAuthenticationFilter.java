package com.example.demo.seguridad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtDecoder decoder;
    public JwtAuthenticationFilter(JwtDecoder decoder) { this.decoder = decoder; }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                // 1. Validar firma, emisor y caducidad
                Jwt jwt = decoder.decode(header.substring(7));
                // 2. Traducir el claim "roles" a autoridades ROLE_*
                List<String> roles = jwt.getClaimAsStringList("roles");
                var authorities = (roles == null ? List.<String>of() : roles).stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r)).toList();
                var authentication = new UsernamePasswordAuthenticationToken(
                    jwt.getSubject(), null, authorities);
                // 3. Guardar la identidad en un SecurityContext nuevo
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
            } catch (JwtException ex) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido");
                return;
            }
        }
        chain.doFilter(request, response);
    }
}

