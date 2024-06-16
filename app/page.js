"use client";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [symptomList, setSymptomList] = useState([]);
  const [zipCode, setZipCode] = useState("");
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
    const response = await fetch("/api/gemini/take-2", {
      method: "POST",
      body: JSON.stringify({ symptoms: symptomList, location: zipCode }),
    });
    const { data } = await response.json();
    console.log(data)
    // setEstimatedCost(data);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <Head>
        <title>MedCost - Hospital Cost Estimator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-12 px-4">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="MedCost Logo" width={200} height={200} />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-center text-white">
          MedCost
        </h1>
        <p className="text-xl mb-8 text-center text-white">
          Know Your Health, Plan Your Costs
        </p>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative mb-4">
            <input
              id="symptoms"
              type="text"
              placeholder="Describe your symptoms"
              className="w-full p-4 text-lg text-white border-4 bg-transparent border-blue-800 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 pl-8"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500 bg-blue-800 rounded-full p-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
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
          <div className="relative mb-4">
            <div className="flex justify-between items-center">
              <input
                id="zipCode"
                type="text"
                placeholder="Zip Code"
                className="w-1/4 p-4 text-lg text-white border-4 bg-transparent border-blue-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-8"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              ></input>
              <div className="absolute inset-y-0 left-[16rem] flex items-center pr-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500 bg-blue-800 rounded-full p-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-xl"
            >
              Search
            </button>
          </div>
        </form>
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
