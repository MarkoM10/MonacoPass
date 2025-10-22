import axios from "axios";
export const fetchZones = async (params?: Record<string, any>) => {
  const response = await axios.get("http://localhost:5000/zone");
  return response.data;
};
