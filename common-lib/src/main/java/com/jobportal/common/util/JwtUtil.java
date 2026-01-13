package com.jobportal.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    public static String extractEmail(String token, String secret) {
        return getClaims(token, secret).getSubject();
    }

    public static String extractRole(String token, String secret) {
        return getClaims(token, secret).get("role", String.class);
    }

    public static Long extractUserId(String token, String secret) {
        return getClaims(token, secret).get("userId", Long.class);
    }

    public static boolean isTokenValid(String token, String secret) {
        try {
            Claims claims = getClaims(token, secret);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private static Claims getClaims(String token, String secret) {
        return Jwts.parser()
                .setSigningKey(getSigningKey(secret))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private static Key getSigningKey(String secret) {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}