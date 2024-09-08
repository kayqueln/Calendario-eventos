import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EventDetail from './components/EventDetail';
import AdminPage from './components/AdminPage';
import ConfirmPresenceForm from './components/ConfirmPresenceForm';
import LoginPage from './components/LoginPage';
import { Grid } from '@mui/material';

const AppRoutes = ({ events, selectedEvent, onCardClick, onClose, open, isAuthenticated, onLogin }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Grid container spacing={2} style={{ marginTop: 16 }}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <EventDetail event={event} onClick={onCardClick} />
                </Grid>
              ))}
            </Grid>
            {selectedEvent && (
              <ConfirmPresenceForm
                event={selectedEvent}
                open={open}
                onClose={onClose}
              />
            )}
          </div>
        }
      />
      <Route
        path="/login"
        element={<LoginPage onLogin={onLogin} />}
      />
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <AdminPage events={events} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
