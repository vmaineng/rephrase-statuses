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
    <div>
      <h2> Rephrase Your Statuses</h2>
      <Form method="post">
        <textarea
          id="status"
          name="status"
          rows={4}
          cols={50}
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter your status here..."
        />
        <button type="submit">Rephrase</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}> {actionData.error}</p>}

      {actionData?.rephrased && (
        <div>
          <h2>Rephrased Statuses:</h2>
          <ul>
            {actionData.rephrased.map((rephrasedStatus, index) => (
              <li key={index}>{rephrasedStatus}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
