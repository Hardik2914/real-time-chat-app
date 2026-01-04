package com.chatapp.chat.websocket;

import com.chatapp.chat.entity.Message;
import com.chatapp.chat.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private MessageRepository messageRepository;

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        if ("CHAT".equals(message.getType())) {
            Message savedMessage = new Message(
                    message.getSender(),
                    message.getText()
            );
            messageRepository.save(savedMessage);
        }

        return message;

    }
    }
