import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = () => {
    if (username === 'admin' && password === '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=') {
      onLogin();
      navigate('/admin')
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Página de Login
      </Typography>
      <TextField
        label="Usuário"
        margin="normal"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Senha"
        type="password"
        margin="normal"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Entrar
      </Button>
    </Box>
  );
};

export default LoginPage;
