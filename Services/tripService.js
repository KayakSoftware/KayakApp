import axios from 'axios';

const isLocalhost = false;
const baseUrl = `http://${isLocalhost ? "localhost" : "192.168.1.29"}:5555`

export default {
  getTrips: async () => {
    let res = await axios.get(`${baseUrl}/trips`);
    return res.data || [];
  },
  getTrip: async (tripId) => {
    let result = await axios.get(`${baseUrl}/trips/${tripId}`)
    return result.data;
  },
  createTrip: async () => {
    let result = await axios.post(`${baseUrl}/trips`)
    return result.data || undefined; 
  },
  endTrip: async (tripId) => {
    let result = await axios.put(`${baseUrl}/trips/${tripId}`);
    return result.data;
  },
  updateTripActivity: async (tripId, tripData) => {
    
    console.log("Updating trip activity for: " + tripId);
    let result = await axios.put(`${baseUrl}/trips/${tripId}/updateTripActivity`, {
      data: tripData
    })

    return result.data;
  }
}
