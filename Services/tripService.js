import axios from 'axios';

export default {
  getTrips: async () => {
      console.log('Service');
    let res = await axios.get(`http://localhost:5555/trips`);
    return res.data || [];
  }
}
