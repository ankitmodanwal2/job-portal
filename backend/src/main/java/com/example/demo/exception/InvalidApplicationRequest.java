package com.example.demo.exception;

public class InvalidApplicationRequest extends RuntimeException {
    public InvalidApplicationRequest(String message) {
        super(message);
    }
}
