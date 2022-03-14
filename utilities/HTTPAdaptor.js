import axios from 'axios';

export default {
    get,
}

function get(
    urlString, 
    parameters = {
        headers: {},
        params: {},
    }
) {
    return axios.get(urlString, parameters);
}
