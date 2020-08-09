import Axios from 'axios';
import {BASE_URL} from 'react-native-dotenv';

Axios.defaults.baseURL = BASE_URL;
export default Axios;