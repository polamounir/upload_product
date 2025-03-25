import { UploadProductTypes } from "@/types";

export const addProduct = async (
  product: UploadProductTypes,
  images: File[]
) => {
  const productData = new FormData();

  productData.append("title", product.title);
  productData.append("price", product.price.toString()); // Ensure price is a string
  productData.append("brand", product.brand);
  productData.append("stock", product.stock.toString()); // Ensure stock is a string
  productData.append("categoryId", product.categoryId);
  productData.append("tags", product.tags);
  productData.append("description", product.description);
// -----------------------------------------
  // console.log(images);
  // const imageArray = Array.from(images);
  
  // console.log(images);

  images.forEach((image, index) => {
    productData.append(`images[${index}]`, image);
  });

  

  console.log("FormData entries:");
  for (const pair of productData.entries()) {
    console.log(pair);
  }

  try {
    const response = await fetch("https://ecommerce.zerobytetools.com/api/products", {
      method: "POST",
      body: productData,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjMzVjYjQyMy1jYzIyLTQwOWMtYTY0YS0wOGRkNjVmYTUzOTgiLCJGdWxsTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBncmFkZWNvbS5jb20iLCJVc2VyVHlwZSI6IkFkbWluIiwibmJmIjoxNzQyNjU1NzAwLCJleHAiOjE4MDc0NTU3MDAsImlhdCI6MTc0MjY1NTcwMH0.CDkxw5Ttsf78GlwCI7vfjdilAhne7jyOzWMjLOCigB8`,
      },
    });

    console.log(response);
    console.log(productData)
    if (!response.ok) throw new Error("Failed to add product");

    return 200;
  } catch (error) {
    console.error(error);
    console.log("Failed to add product");
    return "Failed to add product";
  } finally {
    console.log("Ended");
  }
};
