package com.PetAdoption.Backend.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "messages",
    indexes = {
        @Index(name = "idx_shelter_adopter", columnList = "shelter_name, adopter_email")
    }
)
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key to Shelter entity (assuming shelterName is unique)
    @ManyToOne
    @JoinColumn(name = "shelter_name", referencedColumnName = "name")
    private Shelter shelter;

    // Foreign key to Adopter entity (assuming email is unique)
    @ManyToOne
    @JoinColumn(name = "adopter_email", referencedColumnName = "email")
    private Adopter adopter;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private boolean senderIsAdopter;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Shelter getShelter() { return shelter; }
    public void setShelter(Shelter shelter) { this.shelter = shelter; }

    public Adopter getAdopter() { return adopter; }
    public void setAdopter(Adopter adopter) { this.adopter = adopter; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public boolean isSenderIsAdopter() { return senderIsAdopter; }
    public void setSenderIsAdopter(boolean senderIsAdopter) { this.senderIsAdopter = senderIsAdopter; }
}