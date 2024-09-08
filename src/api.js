import axios from 'axios';

const API_URL = 'https://4ybvpsl4m0.execute-api.us-east-1.amazonaws.com'; 

export const obterEventos = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/eventos`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
};

export const confirmPresence = async (eventId, nome, email) => {
  try {
    await axios.post(`${API_URL}/api/presenca/${eventId}/confirmar`, { nome, email });
  } catch (error) {
    console.error("Erro ao confirmar presença:", error);
    throw error;
  }
};


export const uploadBanner = async ( file , title ) => {
  try {
    const response = await axios.post(`${API_URL}/api/eventos/banner?nomeEvento=${title}`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error("Erro ao fazer upload do banner:", error);
    throw error;
  }
};


export const cadastrarEvento = async (data, horaInicio, horaTermino, titulo, descricao, vagas, bannerUrl) => {
  try {
    await axios.post(`${API_URL}/api/eventos`, { data, horaInicio, horaTermino, titulo, descricao, vagas, bannerUrl });
  } catch (error) {
    console.error("Erro ao fazer upload do banner:", error);
    throw error;
  }
};

export const excluirEvento = async (idEvento) => {
  try {
    await axios.delete(`${API_URL}/api/eventos/${idEvento}`,);
  } catch (error) {
    console.error("Erro ao fazer upload do banner:", error);
    throw error;
  }
};

export const alterarEvento = async (data, horaInicio, horaTermino, titulo, descricao, vagas, bannerUrl, idEvento) => {
  try {
    await axios.put(`${API_URL}/api/eventos/${idEvento}`, { data, horaInicio, horaTermino, titulo, descricao, vagas, bannerUrl });
  } catch (error) {
    console.error("Erro ao fazer upload do banner:", error);
    throw error;
  }
};



