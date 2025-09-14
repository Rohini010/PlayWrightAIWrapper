module.exports = {
  //Login Credentials
  validuser: {
    email: "rohini@example.com",
    password: "Rohini@123",
  },

  invaliduser: {
    email: "rohini212@example.com",
    password: "Rohini@123",
  },

  //Products
  productName: "Winter Top", // for single-product tests
  checkoutProductName: "Men Tshirt", // for checkout test
  productNames: ["Winter Top", "Men Tshirt", "Blue Top"], // for multi-product checkout
  productToRemove: "Blue Top",

  //Messages
  messages: {
    orderSuccess: "Order Placed!",
    loginSuccess: "Logged in successfully!",
    incorrectCredentials: "Your email or password is incorrect!",
  },

  //Payment Data
  payment: {
    name: "Rohini Shilimkar",
    number: "4111111111111111",
    cvc: "123",
    month: "12",
    year: "2027",
  },
};
