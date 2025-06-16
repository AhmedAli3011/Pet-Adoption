package com.PetAdoption.Backend.controller;

import com.PetAdoption.Backend.entity.ChattingMessageDTO;
import com.PetAdoption.Backend.service.ChattingService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ChatingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChattingService chattingService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChattingMessageDTO message) {
        try {
            // Save message to database
            chattingService.saveMessage(message);

            // Determine recipient username (could be shelterName or adopterEmail)
            String recipient = message.isSenderIsAdopter() ? message.getShelterName() : message.getAdopterEmail();

            // Send message to recipient
            messagingTemplate.convertAndSendToUser(
                recipient, "/queue/messages", message
            );
        } catch (Exception e) {
            // Send error response to sender as an object
           
        }
    }
}
