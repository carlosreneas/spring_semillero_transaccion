package com.example.demo.auth;

public record LoginResponse(String accessToken, String tokenType, long expiresInSeconds) {}

