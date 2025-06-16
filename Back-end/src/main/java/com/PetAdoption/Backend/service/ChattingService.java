package com.PetAdoption.Backend.service;

import com.PetAdoption.Backend.entity.Message;
import com.PetAdoption.Backend.entity.Shelter;
import com.PetAdoption.Backend.entity.Adopter;
import com.PetAdoption.Backend.entity.ChattingMessageDTO;
import com.PetAdoption.Backend.repository.MessageRepository;
import com.PetAdoption.Backend.repository.ShelterRepository;
import com.PetAdoption.Backend.repository.AdopterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChattingService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ShelterRepository shelterRepository;

    @Autowired
    private AdopterRepository adopterRepository;

    public void saveMessage(ChattingMessageDTO dto) {
        // Find shelter and adopter by their unique fields
        Shelter shelter = shelterRepository.findByName(dto.getShelterName());
        Adopter adopter = adopterRepository.findByEmail(dto.getAdopterEmail());

        if (shelter == null || adopter == null) {
            // Handle not found (throw exception or log)
            return;
        }

        Message message = new Message();
        message.setShelter(shelter);
        message.setAdopter(adopter);
        message.setContent(dto.getContent());
        message.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);
    }
}
