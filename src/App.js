import React, { useState, useEffect } from 'react';
import { BrowserRouter as RouterDOM } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import AppRoutes from './router';
import { fetchEvents } from './api';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };

    loadEvents();
  }, []);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };



  return (
    <RouterDOM>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Próximos Eventos
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <AppRoutes
          events={events}
          selectedEvent={selectedEvent}
          onCardClick={handleCardClick}
          onClose={handleClose}
          open={open}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
        />
      </Container>
    </RouterDOM>
  );
}

export default App;
