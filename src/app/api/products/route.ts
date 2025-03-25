import { UploadProductTypes } from "@/types";
// import { NextResponse } from "next/server";

const API_BASE_URL = "https://ecommerce.zerobytetools.com";

// Separate function for fetching categories
export async function fetchCategories() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/categories?page=1&limit=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Consider using a more secure method for authentication
          Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
        },
        // Add cache control
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function addNewProduct(
  product: UploadProductTypes,
  images: File[]
) {
  const productData = new FormData();

  // Append all product details
  Object.entries(product).forEach(([key, value]) => {
    // Convert numbers to strings for FormData
    productData.append(
      key,
      typeof value === "number" ? value.toString() : value
    );
  });

  // Append images
  images.forEach((image, index) => {
    productData.append(`images[${index}]`, image);
  });

  console.log("El Data");
  for (const pair of productData.entries()) {
    console.log(pair);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      body: productData,
      headers: {
        // Use environment variable for token
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjMzVjYjQyMy1jYzIyLTQwOWMtYTY0YS0wOGRkNjVmYTUzOTgiLCJGdWxsTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBncmFkZWNvbS5jb20iLCJVc2VyVHlwZSI6IkFkbWluIiwibmJmIjoxNzQyNjU1NzAwLCJleHAiOjE4MDc0NTU3MDAsImlhdCI6MTc0MjY1NTcwMH0.CDkxw5Ttsf78GlwCI7vfjdilAhne7jyOzWMjLOCigB8`,
      },
    });

    console.log(response)
    console.log(response.body)
    if (!response.ok) {
      // Try to parse error response
      const errorData = await response.json().catch(() => ({}));
      return {
        status: response.status,
        message: errorData.message || "Failed to add product",
      };
    }

    return {
      status: response.status,
      message: "Product added successfully!",
    };
  } catch (error) {
    console.error("Failed to add new product:", error);
    console.error( error);

    return {
      status: 500,
      message: "Internal server error. Please try again.",
    };
  }
}
