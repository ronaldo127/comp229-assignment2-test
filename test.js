var assert = require("assert");
const fetch = require("node-fetch");

const urlProduct = "http://localhost:3000/api/products";

describe("API test", function () {
  describe("product", function () {
    let responsePost = null;
    let responseGet = null;

    const input = {
      name: "book",
      description: "some book",
      price: 100,
      quantity: 1,
      category: "Men",
    };

    it("Post a product", async function () {
      responsePost = await fetch(urlProduct, {
        method: "post",
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" },
      });

      responsePost = await responsePost.json();
      assert.ok(responsePost);
    });

    it("Get specific product", async function () {
      responseGet = await fetch(`${urlProduct}/${responsePost._id}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });

      responseGet = await responseGet.json();
      assert.ok(responseGet);

      assert.deepEqual(responsePost, responseGet);
    });

    it("Get from list of products", async function () {
      responseGet = await fetch(`${urlProduct}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });

      responseGet = await responseGet.json();
      assert.ok(responseGet);

      assert.ok(responseGet.length > 0);
    });

    it("Update a product", async function () {
      let newInput = { ...responseGet[0], name: "table" };
      let responsePut = await fetch(`${urlProduct}/${responseGet[0]._id}`, {
        method: "put",
        body: JSON.stringify(newInput),
        headers: { "Content-Type": "application/json" },
      });

      responsePut = await responsePut.json();
      assert.ok(responsePut);

      
      let updatedProduct = await fetch(`${urlProduct}/${responseGet[0]._id}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });

      updatedProduct = await updatedProduct.json();
      assert.ok(updatedProduct);

      assert.deepEqual(updatedProduct, newInput);
    });

    
    it("Get a product by name", async function () {
      responseGet = await fetch(`${urlProduct}?name=table`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });

      responseGet = await responseGet.json();
      assert.ok(responseGet);

      assert.ok(responseGet.length>0);
    });

    it("Delete a product", async function () {
      let responseDelete = await fetch(`${urlProduct}/${responseGet[0]._id}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
      });

      let expected = {
        acknowledged: true,
        deletedCount: 1,
      };

      responseDelete = await responseDelete.json();
      assert.ok(responseDelete);

      assert.deepEqual(responseDelete, expected);
    });

    it("Delete all products", async function () {
      let responseDelete = await fetch(`${urlProduct}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
      });

      responseDelete = await responseDelete.json();
      assert.ok(responseDelete);

      assert.ok(responseDelete.acknowledged);

      
      responseGet = await fetch(`${urlProduct}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });

      responseGet = await responseGet.json();
      assert.ok(responseGet);

      assert.ok(responseGet.length === 0);
    });
  });
});
