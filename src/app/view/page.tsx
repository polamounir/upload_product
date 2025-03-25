"use client";

import { useEffect, useState } from "react";

type ProductTypes = {
    id: string;
    title: string;
    images: string[];
};

export default function ManageProducts() {
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [productsPerPage, setProductPerPage] = useState(20);
    const [productsLength, setProductsLength] = useState(0);

    const getAllProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `https://ecommerce.zerobytetools.com/api/products?page=${pageNumber}&limit=${productsPerPage}`
            );

            if (!res.ok) {
                throw new Error(`Failed to fetch products: ${res.status}`);
            }

            const data = await res.json();

            setProducts(data.items || []);
            setProductsLength(data.totalItems);
        } catch (error) {
            setError("Failed to fetch products");
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [pageNumber, productsPerPage]);

    const handlePageChange = (page: number) => {
        setPageNumber((prev) => prev + page);
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await fetch(
                `https://ecommerce.zerobytetools.com/api/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!res.ok) {
                throw new Error(`Failed to delete product: ${res.status}`);
            }
            getAllProducts();
        } catch (e) {
            console.error("Error deleting product:", e);
        }
    };

    return (
        <div className="md:p-20">

            <div className="bg-white shadow-lg rounded-lg mt-10">
                <h1 className="text-2xl font-bold text-center text-gray-800">
                    All Products
                </h1>
                <div className="flex flex-col lg:flex-row justify-between items-center px-10 mt-20">
                    <button
                        onClick={getAllProducts}
                        disabled={loading}
                        className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? "Loading..." : "Refresh Products"}
                    </button>
                    <div className="flex  flex-col sm:flex-row justify-center items-center gap-5 dark:text-black ">
                        <div>
                             products / page
                            <input type="number" min={10} value={productsPerPage} onChange={(e) => { setProductPerPage(Number(e.target.value)) }} />
                        </div>
                        <div className="flex justify-center items-center mt-4 gap-3">
                            <span>Page {pageNumber}</span>
                            <button
                                className="bg-blue-400 px-5 py-2 rounded-md disabled:bg-gray-500 "
                                onClick={() => handlePageChange(-1)}
                                disabled={pageNumber <= 1}
                            >
                                Previous
                            </button>
                            <button
                                className="bg-blue-400 px-5 py-2 rounded-md disabled:bg-gray-500 "
                                onClick={() => handlePageChange(1)}
                                disabled={productsLength / productsPerPage <= pageNumber}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-10">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <li
                                key={product.id}
                                className="p-3 border rounded-lg shadow-lg hover:bg-gray-100"
                            >
                                <div className="flex items-center justify-between">
                                    <h2>{index + 1}</h2>
                                    <button
                                        className="px-3 py-1 rounded-md bg-red-500 text-white"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        delete
                                    </button>
                                </div>

                                <h2>{product.title}</h2>
                                <div className="flex flex-wrap justify-evenly items-center gap-2 border-t pt-2">
                                    {(product.images ?? []).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={product.title}
                                            className="h-[100px] aspect-square"
                                        />
                                    ))}
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No products found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
