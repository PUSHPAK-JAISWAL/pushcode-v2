package com.pushcode.security.service;

import com.pushcode.security.dto.AuthRequest;
import com.pushcode.security.dto.AuthResponse;
import com.pushcode.security.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    public AuthResponse login(AuthRequest authRequest) {
        var authToken = new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword());
        authenticationManager.authenticate(authToken);
        UserDetails ud = userDetailsService.loadUserByUsername(authRequest.getEmail());
        String token = jwtUtil.generateToken(ud.getUsername());
        return new AuthResponse(token);
    }

}
