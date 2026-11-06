package com.example.demo.dto.response;

public record LoginResponse(String accessToken, String tokenType, long expiresInSeconds) {}

