package com.pushcode.security.controller;

import com.pushcode.security.dto.AuthRequest;
import com.pushcode.security.dto.AuthResponse;
import com.pushcode.security.dto.RegisterRequest;
import com.pushcode.security.dto.UserDto;
import com.pushcode.security.model.User;
import com.pushcode.security.service.AuthService;
import com.pushcode.security.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        User u = userService.registerUser(req);
        UserDto dto = new UserDto();

        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setRoles(u.getRoles());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        AuthResponse res = authService.login(req);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails ud) {
        if(ud == null || ud.getUsername() == null) {
            return ResponseEntity.status(401).body(Map.of("error","Unauthorized"));
        }

        var userOpt = userService.findByEmail(ud.getUsername());
        if(userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error","User not found"));
        }

        var u = userOpt.get();
        UserDto dto = new UserDto();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setRoles(u.getRoles());

        boolean isAdmin = u.getRoles() != null && u.getRoles().stream().anyMatch(r -> r.equalsIgnoreCase("ADMIN") || r.equalsIgnoreCase("ROLE_ADMIN"));

        return ResponseEntity.ok(Map.of(
                "user",dto,
                "isAdmin",isAdmin
        ));
    }

}
