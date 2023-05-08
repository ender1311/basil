import { AddToKrogerCart } from './AddToKrogerCart';

// ...

const handleAddAll = async () => {
  try {
    // Replace with your actual access token
    const accessToken = '{{TOKEN}}';

    // Convert cartItems to the format expected by the Kroger API
    const itemsForKroger = cartItems.map(item => ({
      upc: item.upc,
      quantity: 1, // You can replace this with the actual quantity from the cart item
    }));

    // Call the AddToKrogerCart function and wait for the response
    await AddToKrogerCart(itemsForKroger, accessToken);

    // Show a success message if the items were added successfully
    toast.success('All items added to Kroger cart');
  } catch (error) {
    // Show an error message if there was a problem
    toast.error(`Error adding items to Kroger cart: ${error.message}`);
  }
};

// ...
