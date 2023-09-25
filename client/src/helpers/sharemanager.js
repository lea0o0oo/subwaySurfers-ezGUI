import axios from "axios";
import config from "../config";

async function saveCode(encrypted, decrypted) {
  try {
    const response = await axios.post(`${config.apiBaseURL}/save`, {
      encrypted: encrypted,
      decrypted: decrypted,
    });

    return response.data.code;
  } catch (e) {
    throw e;
  }
}

async function getData(code) {
  try {
    const response = await axios.get(`${config.apiBaseURL}/fetch/${code}`);
    return response.data;
  } catch (e) {
    throw e;
  }
}

export default { saveCode, getData };
