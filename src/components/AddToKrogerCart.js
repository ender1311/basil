// AddToKrogerCart.js


export const AddToKrogerCart = async (items, accessToken) => {
  const url = 'https://api.kroger.com/v1/cart/add';

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      items: items.map(item => ({
        upc: item.upc,
        quantity: item.quantity,
        modality: 'PICKUP',
      })),
    }),
  };

  try {

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const errorResponse = await response.json(); // Get error response from Kroger API
      console.error('Error response from Kroger API:', errorResponse);
      throw new Error(`Kroger API error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error adding items to Kroger cart:', error);
    throw error;
  }
};
