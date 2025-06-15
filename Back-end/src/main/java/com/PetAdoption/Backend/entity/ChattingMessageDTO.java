package com.PetAdoption.Backend.entity;

public class ChattingMessageDTO {
    private String content;
    private String timestamp;

    private String shelterName;
    private String adopterEmail;
    private boolean senderIsAdopter;

    // Getters and setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }

    public String getAdopterEmail() { return adopterEmail; }
    public void setAdopterEmail(String adopterEmail) { this.adopterEmail = adopterEmail; }

    public boolean isSenderIsAdopter() { return senderIsAdopter; }
    public void setSenderIsAdopter(boolean senderIsAdopter) { this.senderIsAdopter = senderIsAdopter; }
}
