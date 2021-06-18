import axios from 'axios';

const BASE_URL = "https://simple-contact-crud.herokuapp.com";

export const getContact = () => axios.get(`${BASE_URL}/contact`);

export const createContact = (payload) => axios.post(`${BASE_URL}/contact`, payload);

export const updateContact = (id,payload) => axios.put(`${BASE_URL}/contact/${id}`, payload);

export const deleteContact = (id) => axios.delete(`${BASE_URL}/contact/${id}`);

export const getContactById = (id) => axios.get(`${BASE_URL}/contact/${id}`);