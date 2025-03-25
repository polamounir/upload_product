"use client"

import { UploadProductTypes } from "@/types"
import { addNewProduct, fetchCategories } from "@/utils/api";
import Image from "next/image";
import { useEffect, useRef, useState } from "react"

import { useDropzone } from "react-dropzone";

// Validation function for form inputs
const validateProductData = (productData: UploadProductTypes, productImages: File[]) => {
  const errors: string[] = [];

  if (!productData.title.trim()) errors.push("Title is required");
  if (productData.price < 1) errors.push("Price must be at least 1");
  if (productData.stock < 1) errors.push("Stock must be at least 1");
  if (!productData.brand.trim()) errors.push("Brand is required");
  if (!productData.categoryId) errors.push("Category must be selected");
  if (!productData.description.trim()) errors.push("Description is required");
  if (productImages.length === 0) errors.push("At least one image is required");

  return errors;
};

export default function UploadProduct() {
  const [productImages, setProductImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productData, setProductData] = useState<UploadProductTypes>({
    title: "",
    brand: "",
    price: 1,
    stock: 1,
    categoryId: "38b41325-0a73-498a-55cd-08dd695a6f25",
    images: [],
    description: "",
    tags: "",
  });

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' }>({ text: "", type: 'success' })
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([
    { id: "", name: "Select Category" },
    {
      "id": "38b41325-0a73-498a-55cd-08dd695a6f25",
      "name": "Laptops"
    },
    {
      "id": "314ea0a5-2c91-4478-55ce-08dd695a6f25",
      "name": "Watches"
    },
    {
      "id": "60072ba9-52bf-4c5a-b72f-1f2e841cdf1e",
      "name": "Mobiles"
    }
  ])

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response.items) {
          setCategories([
            { id: "", name: "Select Category" },
            ...response.items
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMessage({
          text: "Failed to load categories. Please refresh the page.",
          type: 'error'
        });
      }
    }
    loadCategories();
  }, [])

  // Generic input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMessage({ text: "", type: 'success' });
    setProductData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  }

  // Image file handler
  const handleProductImages = (files: File[]) => {
    const newFiles = files.slice(0, 10 - productImages.length);

    const validFiles = newFiles.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "image/avif",
        "image/heic",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setProductImages((prev) => [...prev, ...validFiles]);
    setMessage({ text: "", type: "success" });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => handleProductImages(acceptedFiles),
    maxFiles: 10,
  });



  // Remove image from list
  const removeImage = (indexToRemove: number) => {
    setProductImages(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateProductData(productData, productImages);
    if (validationErrors.length > 0) {
      setMessage({
        text: validationErrors.join('. '),
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await addNewProduct(productData, productImages);

      if (response.status === 200) {
        // Reset form
        setProductData({
          title: "",
          brand: "",
          price: 1,
          stock: 1,
          categoryId: "38b41325-0a73-498a-55cd-08dd695a6f25",
          images: [],
          description: "",
          tags: "",
        });
        setProductImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setMessage({
          text: "Product uploaded successfully!",
          type: 'success'
        });
      } else {
        setMessage({
          text: response.message || "Failed to upload product",
          type: 'error'
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({
        text: "Failed to upload product. Please try again.",
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex justify-center items-center pt-5 pb-20">
      <div className="min-w-sm sm:min-w-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-3 bg-white dark:bg-gray-950 shadow-lg rounded-xl pt-10 p-7 lg:p-15">
            <h2 className="text-3xl mb-3">Upload New Product</h2>

            {/* Error/Success Message */}
            {message.text && (
              <div className={`
                p-3 rounded 
                ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              `}>
                {message.text}
              </div>
            )}

            {/* Rest of the form remains similar to previous implementation */}
            {/* ... (form inputs) ... */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-center gap-2 lg:flex-row lg:gap-5">
                <div className="flex flex-col w-full">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" onChange={handleInputChange} name="title" placeholder="Product Title" value={productData.title} required />
                </div>

              </div>
              <div className="flex flex-col justify-center gap-2 lg:flex-row lg:gap-5">
                <div className="flex flex-col">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" onChange={handleInputChange} name="price" min={1} value={productData.price} required />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="stock">Stock</label>
                  <input type="number" id="stock" onChange={handleInputChange} name="stock" min={1} value={productData.stock} required />
                </div>
                <div className="flex flex-col min-w-[200px]">
                  <label htmlFor="brand">Brand</label>
                  <input type="text" id="brand" onChange={handleInputChange} name="brand" placeholder="Product Brand" value={productData.brand} required />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="categoryId">Category</label>
                <select id="categoryId" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  e.preventDefault();
                  // setMessage("")
                  setProductData({
                    ...productData,
                    categoryId: e.target.value,
                  });
                }} name="categoryId" value={productData.categoryId} className="p-2 border"  >
                  {
                    categories.map((category, index) => (
                      <option key={index} value={category.id}>{category.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="tags">Tags</label>
                <input type="text" id="tags" onChange={handleInputChange} name="tags" placeholder='Tags (ex:"mobile,samsung,2025")' value={productData.tags} required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description">Description</label>
                <textarea id="description" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  e.preventDefault();
                  setMessage({ text: '', type: 'success' })
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  });
                }} name="description" placeholder="Product Description" value={productData.description} required />
              </div>
            </div>

            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
            >
              <input {...getInputProps()} />
              <p className="text-gray-500">Drag & drop images here, or click to select files</p>
            </div>

            {/* File Input (Optional) */}
            <input
              ref={fileInputRef}
              type="file"
              id="images"
              onChange={(e) => handleProductImages(Array.from(e.target.files || []))}
              multiple
              accept="image/*"
              className="hidden"
            />

            <div className="flex justify-center items-center gap-3 flex-wrap">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="border-2 p-3 max-w-[100px] h-[100px] flex justify-center items-center overflow-hidden rounded">
                    <Image src={URL.createObjectURL(image)} alt={image.name} width={100} height={100} className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}