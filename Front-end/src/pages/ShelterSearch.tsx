import React, { useState, useEffect } from 'react';
import { Paper, Stack, TextField, Typography, CircularProgress, Box, Button, IconButton } from '@mui/material';
import CustomAppBar from '../components/AppBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useNavigate } from 'react-router-dom';

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
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
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
    // Navigate to Chatting page with shelter info (e.g., via state or params)
    navigate('/staff/chatting', { state: { shelter } });
  };

  const handleShowMore = () => {
    setOffset(prev => prev + PAGE_SIZE);
  };

  const handleShowLess = () => {
    setOffset(prev => Math.max(0, prev - PAGE_SIZE));
  };

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
      {/* Remove Drawer and chat UI */}
    </>
  );
};

export default ShelterSearch;
