import { api } from "../api/axios";
import { API_ENDPOINT } from "../constants";

const modelService = {
    runModel: async () => {
        const response = await api.get(API_ENDPOINT.MODEL_RUN);
        return response.data;
    }
}

export default modelService;