package com.chatapp.chat.controller;

public class UserResponse {
    private Long id;
    private String username;
    private String displayName;

    public UserResponse(Long id, String username, String displayName) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return displayName;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
