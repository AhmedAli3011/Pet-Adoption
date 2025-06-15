import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton, Divider, TextField, Button, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate } from 'react-router-dom';
// You may need to install and import a STOMP client, e.g. @stomp/stompjs
import { Client } from '@stomp/stompjs';

const WS_URL = 'ws://localhost:8080/ws'; // Adjust if needed

const Chatting: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shelter = location.state?.shelter;
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  // Replace with actual user/adopter info
  const adopterEmail = 'user@example.com';

  // Fetch chat history on mount
  useEffect(() => {
    if (!shelter) {
      navigate(-1);
      return;
    }
    // Fetch chat history from backend
    fetch(`http://localhost:8080/api/messages?shelterName=${encodeURIComponent(shelter.name)}&adopterEmail=${encodeURIComponent(adopterEmail)}`)
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(
            data.map((msg: any) => ({
              sender: msg.senderIsAdopter ? 'me' : 'shelter',
              text: msg.content
            }))
          );
        }
      })
      .catch(() => { /* ignore errors for now */ });
  }, [shelter, adopterEmail, navigate]);

  useEffect(() => {
    if (!shelter) {
      navigate(-1);
      return;
    }

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to personal queue for incoming messages
        client.subscribe(`/user/queue/messages`, (msg) => {
          const body = typeof msg.body === 'string' ? JSON.parse(msg.body) : msg.body;
          if (body && body.content) {
            setMessages(prev => [...prev, { sender: body.senderIsAdopter ? 'me' : 'shelter', text: body.content }]);
          } else if (typeof body === 'string') {
            // handle error message
            setMessages(prev => [...prev, { sender: 'system', text: body }]);
          }
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [shelter, navigate]);

  const handleSend = () => {
    if (!input.trim() || !stompClientRef.current || !shelter) return;
    const msg = {
      shelterName: shelter.name,
      adopterEmail: adopterEmail,
      content: input,
      senderIsAdopter: true,
      timestamp: new Date().toISOString(),
    };
    stompClientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(msg),
    });
    setMessages(prev => [...prev, { sender: 'me', text: input }]);
    setInput('');
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Paper sx={{ maxWidth: 500, margin: '2rem auto', p: 0, borderRadius: 2, display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Chat with {shelter?.name}
        </Typography>
        <IconButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Box
              sx={{
                bgcolor: msg.sender === 'me' ? '#1976d2' : '#e0e0e0',
                color: msg.sender === 'me' ? '#fff' : '#222',
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: '80%',
                wordBreak: 'break-word'
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
        <div ref={chatBottomRef} />
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          sx={{ flex: 1, mr: 1 }}
        />
        <Button variant="contained" onClick={handleSend} disabled={!input.trim()}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chatting;
