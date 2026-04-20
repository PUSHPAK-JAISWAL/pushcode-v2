package com.pushcode.security.dto;

import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Set;

@Data
public class UserDto {
    private ObjectId id;
    private String email;
    private Set<String> roles;
}
