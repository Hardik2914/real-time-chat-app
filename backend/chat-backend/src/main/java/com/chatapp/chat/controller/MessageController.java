package com.chatapp.chat.controller;

import com.chatapp.chat.entity.Message;
import com.chatapp.chat.repository.MessageRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageRepository messageRepository;
    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    @GetMapping
    public List<Message> getMessages() {
        return messageRepository.findTop50ByOrderByTimestampAsc();
    }
}
