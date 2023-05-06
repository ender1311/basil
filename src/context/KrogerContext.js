import { createContext, useContext, useState, useEffect } from "react";

const KrogerContext = createContext();

export function useKrogerContext() {
  return useContext(KrogerContext);
}

export function KrogerProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [groceryItems, setGroceryItems] = useState([]);
  
  // Your Kroger API client ID and secret
  const CLIENT_ID = process.env.REACT_APP_kroger_clientId;
  const CLIENT_SECRET = process.env.REACT_APP_kroger_clientSecret;

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
          },
          body: "grant_type=client_credentials&scope=product.compact",
        });

        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, [CLIENT_ID, CLIENT_SECRET]);

  const value = {
    accessToken,
  };

  return (
    <KrogerContext.Provider value={{ accessToken, setAccessToken, groceryItems, setGroceryItems }}>
      {children}
    </KrogerContext.Provider>
  );
}
