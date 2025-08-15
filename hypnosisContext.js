// hypnosisContext.js
import axios from 'axios';

export async function generateMeditation(data, uid) {
  try {
    if (!uid) {
      console.error('No UID available');
      return;
    }

    const requestData = {
      uid,  // Include the UID in the request data
      ...data,   // Spread the rest of the data object
    };

    //   Default: const response = await axios.post('http://192.110.56.1:8080/generate', requestData);
    
    // const response = await axios.post('http://93.16.200.118:8080/generate', requestData,
    
    const response = await axios.post('http://192.174.56.1:8080/generateMeditation', requestData,
    // {
    //   headers: {
    //     Authorization: `Bearer ${serviceAccountCredentials.access_token}`,
    //   },
    // }
    );
    console.log(response.data);  // Log the response data to the console
    return response.data; // How is this being sent to the audio player?
  } catch (error) {
    console.error(error);  // Log any errors to the console
  }
}

  
