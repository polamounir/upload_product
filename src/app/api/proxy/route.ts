import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.formData();

    const response = await fetch(
      "https://ecommerce.zerobytetools.com/api/products",
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ error: errorData.message || "API Error" }),
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    // Fetch categories from the external API
    const response = await fetch(
      `https://ecommerce.zerobytetools.com/api/categories?page=1&limit=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
