import { UploadProductTypes } from "@/types";

const API_BASE_URL = "https://ecommerce.zerobytetools.com";

// Function to fetch categories
export async function fetchCategories() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/categories?page=1&limit=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjMzVjYjQyMy1jYzIyLTQwOWMtYTY0YS0wOGRkNjVmYTUzOTgiLCJGdWxsTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBncmFkZWNvbS5jb20iLCJVc2VyVHlwZSI6IkFkbWluIiwibmJmIjoxNzQyNjU1NzAwLCJleHAiOjE4MDc0NTU3MDAsImlhdCI6MTc0MjY1NTcwMH0.CDkxw5Ttsf78GlwCI7vfjdilAhne7jyOzWMjLOCigB8`,
        },
        next: { revalidate: 3600 }, // Cache response for 1 hour
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

// Function to add a new product
export async function addNewProduct(
  product: UploadProductTypes,
  images: File[]
) {
  const productData = new FormData();

  Object.entries(product).forEach(([key, value]) => {
    productData.append(
      key,
      typeof value === "number" ? value.toString() : value
    );
  });

  images.forEach((image, index) => {
    productData.append(`images[${index}]`, image);
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      body: productData,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjMzVjYjQyMy1jYzIyLTQwOWMtYTY0YS0wOGRkNjVmYTUzOTgiLCJGdWxsTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBncmFkZWNvbS5jb20iLCJVc2VyVHlwZSI6IkFkbWluIiwibmJmIjoxNzQyNjU1NzAwLCJleHAiOjE4MDc0NTU3MDAsImlhdCI6MTc0MjY1NTcwMH0.CDkxw5Ttsf78GlwCI7vfjdilAhne7jyOzWMjLOCigB8`,
      },
    });

    if (!response.ok) {
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

    return {
      status: 500,
      message: "Internal server error. Please try again.",
    };
  }
}
