const createProduct = (id, name, price) => ({
  id,
  name,
  suggested_price: price,
  created_at: new Date(),
  updated_at: new Date()
});

module.exports = {
    Product1: createProduct(1,'Smartphone A21s',2500),
    Product2: createProduct(2,'Notebook Dell',3500),
    Product3: createProduct(3,'Mackbook Pro',7500),
    Product4: createProduct(4,'Pc Gamer ',5500),
    Product5: createProduct(5,'Monitor Ultrawide Curvo',1700),
    Product6: createProduct(6,'Teclado Husky Gaming Blizzard',229),
    Product7: createProduct(7,'Mouse Gamer Redragon Cobra',114.90),
    Product8: createProduct(8,'Playstation 5',5900),
    Product9: createProduct(9,'Impressora Multifuncional HP Ink Advantage',499.90),
    Product10: createProduct(10,'Smart TV Samsung 75´ 8K Neo ',21999),
}