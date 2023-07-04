/*import { getIpAddressAsync } from "expo-network";
import AsyncStorage from "@react-native-async-storage/async-storage";

let url = '';

export const setBaseUrl = async () => {
    const netIp = await getIpAddressAsync();
    
    url = `http://${netIp}:8000/api/`

    AsyncStorage.setItem('base_url', JSON.stringify(url));
}

function getBaseUrl(){
    let res = AsyncStorage.getItem('base_url');
    res = JSON.parse(res);

    return res;
}

export const BASE_URL = getBaseUrl();*/

//export const BASE_URL = 'http://192.168.100.15:8000/api/'; //Rede casa
//export const BASE_URL = 'http://10.25.206.160:8000/api/'; //Rede unitel

export const BASE_URL = 'http://192.168.53.188:8000/api/'; //Rede Mi Note 10