import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Rephrase App" },
    { name: "Rephrase your statuses today", content: "Welcome to Rephrase!" },
  ];
};

import { useState } from "react";
import { json, ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

interface ActionData {
  rephrased?: string[];
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const status = formData.get("status");

  if (typeof status !== "string" || !status.trim()) {
    return json<ActionData>(
      { error: "Please enter a status to rephrase." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("http://localhost:8000/api/rephrase/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      return json<ActionData>(
        { error: errorData?.error || "Failed to fetch rephrased statuses." },
        { status: response.status }
      );
    }
    const responseData = await response.json();
    return json<ActionData>({ rephrased: responseData.rephrased });
  } catch (error: any) {
    console.error("Error fetching from backend:", error);
    return json<ActionData>({ error: "An unexpected error occurred." });
  }
};

export default function Index() {
  const [inputText, setInputText] = useState("");
  const actionData = useActionData<ActionData>();

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="mt-10 DM Serif Text max-w-md mx-auto p-6 border border-gray-300 rounded-md bg-gray-100">
      <h2 className="text-xl text-gray-700 text-center mb-4">
        Rephrase Your Statuses
      </h2>
      <Form method="post" className="flex flex-col gap-2 mb-4">
        <textarea
          id="status"
          name="status"
          rows={4}
          className="p-2 border border-gray-300 rounded-md text-sm"
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter your status here..."
        />
        <button
          type="submit"
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Rephrase
        </button>
      </Form>
      {actionData?.error && (
        <p className="text-red-500 mb-2">{actionData.error}</p>
      )}

      {actionData?.rephrased && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-lg text-gray-600 mb-2">Rephrased Statuses:</h2>
          <ul className="list-none p-0">
            {actionData.rephrased.map((rephrasedStatus, index) => (
              <li
                key={index}
                className="py-2 border-b border-gray-100 text-gray-600 last:border-b-0"
              >
                {rephrasedStatus}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
