package com.example.demo;

import com.example.demo.seguridad.AccesoSemillero;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AutorizacionTest {
    @Autowired MockMvc mockMvc;
    @MockitoBean(name = "acceso") AccesoSemillero acceso;

    @Test
    void sinTokenRecibe401() throws Exception {
        mockMvc.perform(get("/api/semilleros/mios"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void miembroNoPuedeListarUsuarios() throws Exception {
        mockMvc.perform(get("/api/usuarios")
                .with(jwt().jwt(j -> j.subject("miembro1@universidad.edu.co"))
                           .authorities(new SimpleGrantedAuthority("ROLE_MIEMBRO"))))
            .andExpect(status().isForbidden());
    }

    @Test
    void semilleroSinRelacionRecibe403() throws Exception {
        when(acceso.puedeVer(eq(7L), any())).thenReturn(false);
        mockMvc.perform(get("/api/semilleros/7")
                .with(jwt().jwt(j -> j.subject("director.software@universidad.edu.co"))
                           .authorities(new SimpleGrantedAuthority("ROLE_DIRECTOR"))))
            .andExpect(status().isForbidden());
    }
}

