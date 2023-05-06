import React, { useEffect, useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';

const clientId = process.env.REACT_APP_kroger_clientId;
const clientSecret = process.env.REACT_APP_kroger_clientSecret;
const redirectUri = 'http://localhost:3000/kroger'; // Make sure to replace this with your own redirect URI


const base64Encode = (data) => {
    return Buffer.from(data, 'binary').toString('base64');
  };


export function KrogerPage() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {

    const getAccessToken = async (code) => {
      try {
        const response = await axios.post('https://api.kroger.com/v1/connect/oauth2/token', null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${base64Encode(`${clientId}:${clientSecret}`)}`,    
        },
          params: {
            grant_type: 'client_credentials',
            scope: 'product.compact', // Specify the required scope(s) here
  
          },
        });

        console.log(response.data);
        setAccessToken(response.data.access_token);
        return;
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    };

    const code = queryString.parse(window.location.search).code;

    if (code) {
      getAccessToken(code);
    } else {
        const authUrl = `https://api.kroger.com/v1/connect/oauth2/authorize?${queryString.stringify({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'product.compact', // Specify the required scope(s) here
          })}`;
          

      window.location.href = authUrl;
    }
  }, []);



  return (
    <div>
      {accessToken ? <p>Access token: {accessToken}</p> : <p>Loading...</p>}
    </div>
  );
}
