"use client"

import { UploadProductTypes } from "@/types"
import { addProduct } from "@/utils/api";
import Image from "next/image";
import {  useRef, useState } from "react"


export default function UplodProduct() {

  const [productImages, setProductImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productData, setProductData] = useState<UploadProductTypes>({
    title: "",
    brand: "",
    price: 1,
    stock: 1,
    categoryId: "314ea0a5-2c91-4478-55ce-08dd695a6f25",
    images: [],
    description: "",
    tags: "",
  });

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const categories=[{
    id: "",
    name: "Select Category",
  }, {
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
  ]

  const handleProductData = (e: React.ChangeEvent<HTMLInputElement>) => {

    e.preventDefault();
    setMessage("")
    const { name, value } = e.target
    setProductData({
      ...productData,
      [name]: value,
    });
  }
  const handleProductImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage("")

    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setProductImages((prevImages) => [...prevImages, ...newFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await addProduct(productData, productImages);
      console.log("Product added:", response);
      if (response === 200) {

        setMessage("Product uploaded successfully!");
        setProductData({
          title: "",
          brand: "",
          price: 1,
          stock: 1,
          categoryId: "314ea0a5-2c91-4478-55ce-08dd695a6f25",
          images: [],
          description: "",
          tags: "",
        });
        setProductImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage("Failed to upload product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to upload product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="min-h-dvh flex justify-center items-center pt-5 pb-20">
      <div className="min-w-sm sm:min-w-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-3 bg-slate-100 pt-10 p-7 lg:p-15">
            <h2 className="text-3xl mb-3">Upload New Product</h2>
            <h2 className="text-xl mb-3">{message}</h2>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-center gap-2 lg:flex-row lg:gap-5">
                <div className="flex flex-col w-full">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" onChange={handleProductData} name="title" placeholder="Product Title" value={productData.title} required />
                </div>

              </div>
              <div className="flex flex-col justify-center gap-2 lg:flex-row lg:gap-5">
                <div className="flex flex-col">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" onChange={handleProductData} name="price" min={1} value={productData.price} required />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="stock">Stock</label>
                  <input type="number" id="stock" onChange={handleProductData} name="stock" min={1} value={productData.stock} required />
                </div>
                <div className="flex flex-col min-w-[200px]">
                  <label htmlFor="brand">Brand</label>
                  <input type="text" id="brand" onChange={handleProductData} name="brand" placeholder="Product Brand" value={productData.brand} required />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="categoryId">Category</label>
                <select id="categoryId" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  e.preventDefault();
                  setMessage("")
                  setProductData({
                    ...productData,
                    categoryId: e.target.value,
                  });
                }} name="categoryId" value={productData.categoryId} className="p-2 border" required >
                  {
                    categories.map((category, index) => (
                      <option key={index} value={category.id}>{category.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="tags">Tags</label>
                <input type="text" id="tags" onChange={handleProductData} name="tags" placeholder='Tags (ex:"mobile,samsung,2025")' value={productData.tags} required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description">Description</label>
                <textarea id="description" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  e.preventDefault();
                  setMessage("")
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  });
                }} name="description" placeholder="Product Description" value={productData.description} required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="images">Product Images</label>
                <input ref={fileInputRef} type="file" id="images" onChange={handleProductImages} name="images" multiple required />
              </div>
              <div className="flex gap-3 flex-wrap">
                {
                  productImages.map((image, index) => (
                    <div key={index}>
                      <div className="border-2 p-3 max-w-[100px] h-[100px] flex justify-center items-center overflow-hidden rounded">
                        <Image src={URL.createObjectURL(image)} alt={image.name} width={100} height={100} />
                      </div>
                    </div>
                  ))
                }
              </div>

              <button type="submit" disabled={isLoading}>{isLoading ? " wait .... " : "Upload"}</button>
            </div>
          </div>
        </form >
      </div >
    </div >

  )
}
