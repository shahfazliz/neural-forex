import axios from 'axios';

export default class HTTPAdaptor {
    get(
        urlString, 
        parameters = {
            headers: {},
            params: {},
        }
    ) {
        return axios.get(urlString, parameters);
    }
}