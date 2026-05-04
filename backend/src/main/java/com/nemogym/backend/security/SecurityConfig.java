package com.nemogym.backend.security;

import org.springframework.beans.factory.annotation.Value;
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
        @Value("${app.cors.origin}")
        private String corsOrigin;

        public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                        CustomAccessDeniedHandler customAccessDeniedHandler) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.customAccessDeniedHandler = customAccessDeniedHandler;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> {
                                })
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/auth/**").permitAll()
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/avisos").permitAll()
                                                .requestMatchers("/me").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/clases/**")
                                                .hasAnyRole("USER", "ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.POST, "/clases/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.PUT, "/clases/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.DELETE, "/clases/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.POST, "/avisos", "/avisos/")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.DELETE, "/avisos/**")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers(HttpMethod.GET, "/membresias/**")
                                                .hasAnyRole("USER", "ADMIN", "COACH")
                                                .requestMatchers("/membresias/**").hasRole("ADMIN")
                                                .requestMatchers("/admin/users/aptos-personalizada")
                                                .hasAnyRole("ADMIN", "COACH")
                                                .requestMatchers("/admin/users/**").hasRole("ADMIN")
                                                .requestMatchers("/roles/**").hasRole("ADMIN")
                                                .requestMatchers("/reportes/**").hasRole("ADMIN")

                                                .anyRequest().authenticated())
                                .exceptionHandling(ex -> ex
                                                .accessDeniedHandler(customAccessDeniedHandler))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(List.of(corsOrigin));
                System.out.println("CORS ORIGIN: " + corsOrigin);
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return source;
        }
}