package com.hms.hms_backend.security;

import com.hms.hms_backend.entities.UserAccount;
import com.hms.hms_backend.daos.UserAccountDao;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserAccountDao userAccountDao;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // ✅ 0) Skip CORS Preflight (OPTIONS request)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 1) Skip Auth endpoints (login/register)
        String path = request.getServletPath();
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("JWT FILTER CALLED");

        // ✅ Debug: check Authorization header
        String authHeader = request.getHeader("Authorization");
        System.out.println("AUTH HEADER => " + authHeader);

        // 2️⃣ If no token, continue
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3️⃣ Extract token
        String token = authHeader.substring(7);

        try {
            // 4️⃣ Extract email from token
            String email = jwtTokenUtil.extractEmail(token);

            // 5️⃣ If not already authenticated
            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                // 6️⃣ Fetch user from DB
                UserAccount userAccount = userAccountDao
                        .findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // 7️⃣ Create authority
                List<SimpleGrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority(
                                "ROLE_" + userAccount.getRole().name()
                        ));

                // 8️⃣ Create authentication token
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userAccount,
                                null,
                                authorities
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // 9️⃣ Set authentication
                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

}