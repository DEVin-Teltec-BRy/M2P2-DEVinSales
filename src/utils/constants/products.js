const createProduct = (name, price) => ({
  name,
  suggested_price: price,
  created_at: new Date(),
  updated_at: new Date(),
});

module.exports = {
  Product1: createProduct("Smartphone A21s", 2500),
  Product2: createProduct("Notebook Dell", 3500),
  Product3: createProduct("Mackbook Pro", 7500),
  Product4: createProduct("Pc Gamer", 5500),
  Product5: createProduct("Monitor Ultrawide Curvo", 1700),
  Product6: createProduct("Teclado Husky Gaming Blizzard", 229),
  Product7: createProduct("Mouse Gamer Redragon Cobra", 114.9),
  Product8: createProduct("Playstation 5", 5900),
  Product9: createProduct("Impressora Multifuncional HP Ink Advantage", 499.9),
  Product10: createProduct("Smart TV Samsung 75´ 8K Neo", 21999),
};
