"use client";
import { useSearchParams } from "next/navigation";

export default function OutputPage() {
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("data"));

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Output</h1>
      <div className="bg-black p-6 rounded-lg shadow-lg">
        {Object.entries(data).map(([category, values]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">{category}</h2>
            <ul className="list-disc pl-6">
              {values.map((value, index) => (
                <li key={index} className="mb-2">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}