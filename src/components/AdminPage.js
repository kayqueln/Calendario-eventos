import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List, 
  ListItem, 
  ListItemText,
  FormControl,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { cadastrarEvento, uploadBanner, excluirEvento, alterarEvento } from '../api'; 

const AdminPage = ({ events, onLogout }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogParticipantes, setOpenDialogParticipantes] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [spots, setSpots] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null); 

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setOpenDialogParticipantes(false);
    resetForm();
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      const imageUrl = await uploadBanner(formData, title);
      return imageUrl
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    }
  };

  const handleSubmit = async () => {
    try {
        if (!title || !date || !description || !spots) {
          alert('Por favor, preencha todos os campos.');
          return;
        }

        setUploading(true);
        handleClose();
        const bannerUrl = await handleUploadImage();

        if (editingEvent) {
            await alterarEvento(date, title, description, parseInt(spots, 10), bannerUrl, editingEvent._id);
        } else {
            await cadastrarEvento(date, title, description, parseInt(spots, 10), bannerUrl);
        }
        
        handleClose();
        window.location.reload(); 
    } catch (error) {
      console.error('Erro ao cadastrar evento:', error);
      alert('Erro ao cadastrar evento.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.titulo);
    setDate(event.data);
    setDescription(event.descricao);
    setSpots(event.vagas);
    setImageFile(null); 
    setOpenDialog(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Você tem certeza que deseja excluir este evento?')) {
      try {
        await excluirEvento(eventId);
        window.location.reload(); 
      } catch (error) { 
        console.error('Erro ao excluir evento:', error);
        alert('Erro ao excluir evento.');
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setDescription('');
    setSpots('');
    setImageFile(null);
    setEditingEvent(null); 
  };

  const handleOpenParticipants = (event) => {
    setSelectedEvent(event);
    setOpenDialogParticipantes(true);
  };

  return (
    <div style={{ marginTop: "4rem" }}>
      {uploading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            zIndex: 1000 
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div>
    </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Página de Administração
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Cadastrar Evento
        </Button>
      </div>

      <TableContainer component={Paper} style={{ marginTop: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Vagas</TableCell>
              <TableCell>Participantes</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.titulo}</TableCell>
                <TableCell>{event.data}</TableCell>
                <TableCell>{event.descricao}</TableCell>
                <TableCell>{event.vagas}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleOpenParticipants(event)}>
                    Ver Participantes
                  </Button>
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => handleEdit(event)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Excluir">
                    <IconButton color="error" onClick={() => handleDelete(event._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialogParticipantes} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Participantes do Evento</DialogTitle>
        <DialogContent>
          {selectedEvent && selectedEvent.participantes.length > 0 ? (
            <List>
              {selectedEvent.participantes.map((participant, index) => (
                <ListItem key={index}>
                   <ListItemText
                    primary={participant.nome}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {participant.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Código: {participant.hashParticipante}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum participante registrado para este evento.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{editingEvent ? 'Editar Evento' : 'Cadastrar Novo Evento'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Data"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Vagas"
            type="number"
            fullWidth
            value={spots}
            onChange={(e) => setSpots(e.target.value)}
          />
          <FormControl fullWidth style={{ marginTop: 16 }}>
            <Button
              variant="contained"
              component="label"
              style={{ width: '100%' }}
            >
              {imageFile ? imageFile.name : 'Escolher Banner'}
              <input
                id="file-upload"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Button>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingEvent ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPage;