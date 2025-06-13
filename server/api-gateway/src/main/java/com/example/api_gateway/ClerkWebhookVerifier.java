package com.example.api_gateway;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Component
public class ClerkWebhookVerifier {
    
    public boolean verifyWebhook(String payload, String signature, String secret) {
        try {
            // Remove the 'whsec_' prefix from the secret
            String cleanSecret = secret.startsWith("whsec_") ? secret.substring(6) : secret;
            
            // Decode the base64 secret
            byte[] decodedSecret = java.util.Base64.getDecoder().decode(cleanSecret);
            
            // Create the expected signature
            String expectedSignature = generateSignature(payload, decodedSecret);
            
            // Compare signatures (timing-safe comparison)
            return constantTimeEquals(signature, expectedSignature);
            
        } catch (Exception e) {
            return false;
        }
    }
    
    private String generateSignature(String payload, byte[] secret) 
            throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret, "HmacSHA256");
        mac.init(secretKeySpec);
        
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return java.util.Base64.getEncoder().encodeToString(hash);
    }
    
    private boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}