import React, { useState, useEffect, useRef } from 'react';
import { Paper, Stack, TextField, Typography, CircularProgress, Box, Button, IconButton, Drawer, Divider } from '@mui/material';
import CustomAppBar from '../components/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// Mock data for fallback/demo
const mockShelters = [
  { id: 1, name: 'Happy Tails Shelter' },
  { id: 2, name: 'Paws & Claws Rescue' },
  { id: 3, name: 'Furry Friends Haven' },
  { id: 4, name: 'Safe Haven Shelter' },
  { id: 5, name: 'Animal Angels' },
  { id: 6, name: 'Pet Paradise' },
  { id: 7, name: 'Shelter of Hope' },
];

const PAGE_SIZE = 5;

const ShelterSearch: React.FC = () => {
  const [search, setSearch] = useState('');
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatShelter, setChatShelter] = useState<any>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setOffset(0);
  }, [search]);

  useEffect(() => {
    const fetchShelters = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('sheltername', search);
      params.append('size', PAGE_SIZE.toString());
      params.append('offset', offset.toString());
      try {
        // Use full backend URL (adjust port if needed)
        const res = await fetch(`http://localhost:8080/shelter/search?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setShelters(data);
        } else if (!search) {
          setShelters(mockShelters.slice(offset, offset + PAGE_SIZE));
        } else {
          setShelters([]);
        }
      } catch (e) {
        setShelters(!search ? mockShelters.slice(offset, offset + PAGE_SIZE) : []);
      }
      setLoading(false);
    };
    fetchShelters();
  }, [search, offset]);

  const handleOpenChat = (shelter: any) => {
    setChatShelter(shelter);
    setChatOpen(true);
    setMessages([
      { sender: 'shelter', text: `Welcome to ${shelter.name}! How can we help you?` }
    ]);
    setInput('');
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setChatShelter(null);
    setMessages([]);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages(prev => [
      ...prev,
      { sender: 'me', text: input }
    ]);
    setInput('');
    // Optionally, simulate a reply after a delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'shelter', text: 'Thank you for your message! We will get back to you soon.' }
      ]);
    }, 1000);
  };

  const handleShowMore = () => {
    setOffset(prev => prev + PAGE_SIZE);
  };

  const handleShowLess = () => {
    setOffset(prev => Math.max(0, prev - PAGE_SIZE));
  };

  useEffect(() => {
    if (chatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  return (
    <>
      <CustomAppBar />
      <Paper sx={{ maxWidth: 600, margin: '2rem auto', padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Shelter Search</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Search by shelter name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Stack>
        {loading ? (
          <Stack alignItems="center" sx={{ py: 2 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <Stack spacing={2}>
              {shelters.length === 0 ? (
                <Typography color="text.secondary">No shelters found.</Typography>
              ) : (
                shelters.map((shelter: any) => (
                  <Box
                    key={shelter.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #eee',
                      borderRadius: 2,
                      p: 2,
                      background: '#fafafa',
                    }}
                  >
                    <Typography>{shelter.name}</Typography>
                    <Button variant="contained" size="small" onClick={() => handleOpenChat(shelter)}>
                      Chat
                    </Button>
                  </Box>
                ))
              )}
            </Stack>
            {(shelters.length === PAGE_SIZE || offset > 0) && (
              <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
                <IconButton onClick={handleShowLess} disabled={offset === 0}>
                  <ArrowDropUpIcon />
                </IconButton>
                <IconButton
                  onClick={handleShowMore}
                  disabled={shelters.length < PAGE_SIZE}
                >
                  <ArrowDropDownIcon />
                </IconButton>
              </Stack>
            )}
          </>
        )}
      </Paper>
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={handleCloseChat}
        PaperProps={{
          sx: { width: 350, display: 'flex', flexDirection: 'column', height: '100%' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Chat with {chatShelter?.name}
          </Typography>
          <IconButton onClick={handleCloseChat}>
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
      </Drawer>
    </>
  );
};

export default ShelterSearch;
