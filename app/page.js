"use client";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [symptomList, setSymptomList] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === "+") {
      e.preventDefault();
      if (symptoms.trim() !== "") {
        setSymptomList([...symptomList, symptoms.trim()]);
        setSymptoms("");
      }
    }
  };

  const removeSymptom = (index) => {
    const updatedSymptomList = [...symptomList];
    updatedSymptomList.splice(index, 1);
    setSymptomList(updatedSymptomList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({ userInput: symptomList.join(", ") }),
    });
    const { data } = await response.json();
    setEstimatedCost(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-700">
      <Head>
        <title>MedCost - Hospital Cost Estimator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-12 px-4">
        <div className="flex justify-center mb-8">
          <Image
            src="/Images/Logo.png"
            alt="MedCost Logo"
            width={200}
            height={200}
          />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-center text-white">
          MedCost
        </h1>
        <p className="text-xl mb-8 text-center text-white">
          Know Your Health, Plan Your Costs
        </p>
        <form onSubmit={handleSubmit} className="mb-8 relative">
          <input
            id="symptoms"
            type="text"
            placeholder="Describe your symptoms"
            className="w-full p-4 mb-4 text-lg text-white bg-blue-800 border border-blue-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="flex flex-wrap mb-4">
            {symptomList.map((symptom, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2 cursor-pointer hover:bg-red-500 hover:text-white"
                onClick={() => removeSymptom(index)}
              >
                {symptom}
                <span className="ml-2 text-red-500 font-bold hover:text-white">
                  &#10005;
                </span>
              </span>
            ))}
          </div>
        </form>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl"
            onClick={handleSubmit}
          >
            Estimate Cost
          </button>
        </div>
        {estimatedCost && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-blue-900">
              Estimated Hospital Cost
            </h2>
            <p className="text-blue-900 text-xl">{estimatedCost}</p>
          </div>
        )}
      </main>
    </div>
  );
}
