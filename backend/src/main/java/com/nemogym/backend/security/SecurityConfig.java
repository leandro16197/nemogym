package com.nemogym.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final CustomAccessDeniedHandler customAccessDeniedHandler;

        public SecurityConfig(
                        JwtAuthFilter jwtAuthFilter,
                        CustomAccessDeniedHandler customAccessDeniedHandler) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.customAccessDeniedHandler = customAccessDeniedHandler;
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOriginPatterns(List.of("*"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setExposedHeaders(List.of("Authorization"));
                config.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return source;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http.csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers("/auth/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/mercadopago/webhook").permitAll()
                                                .requestMatchers("/mercadopago/**").permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/avisos", "/avisos/**").permitAll()
                                                .requestMatchers("/me").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/clases", "/clases/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/clases", "/clases/  **")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.PUT, "/clases", "/clases/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.DELETE, "/clases", "/clases/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.GET, "/membresias", "/membresias/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/membresias/adquirir/**")
                                                .hasAnyRole("USER", "ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.POST, "/membresias", "/membresias/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.PUT, "/membresias/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.DELETE, "/membresias/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.POST, "/avisos", "/avisos/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.DELETE, "/avisos/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.POST, "/clases-personalizadas/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers("/admin/users/aptos-personalizada")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers("/admin/users/**").hasRole("ADMIN")
                                                .requestMatchers("/roles/**").hasRole("ADMIN")
                                                .requestMatchers("/api/reportes/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())

                                .exceptionHandling(ex -> ex.accessDeniedHandler(customAccessDeniedHandler))

                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}