package com.pushcode.security.dto;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class AuthResponse {

    @Nonnull
    private String token;

    private String tokenType = "Bearer";

}
