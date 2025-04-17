import React, { useState } from "react";

interface StatusInputProps {
  onStatusChange: (text: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputText: string;
}

export default function StatusInput({
  onStatusChange,
  onSubmit,
  inputText,
}: StatusInputProps) {
  return (
    <form method="post" onSubmit={onSubmit}>
      <textarea
        id="status"
        name="status"
        rows={4}
        cols={50}
        value={inputText}
        onChange={(e) => onStatusChange(e.target.value)}
        placeholder="Enter your status here..."
      />
      <button type="submit">Rephrase</button>
    </form>
  );
}
