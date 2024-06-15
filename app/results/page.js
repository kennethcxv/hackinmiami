// app/results/page.js
"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const [diseaseData, setDiseaseData] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchDiseaseData = async () => {
      const symptoms = searchParams.get("symptoms");
      const zipCode = searchParams.get("zipCode");
      const userInput = `Symptoms: ${symptoms}, Zip Code: ${zipCode}`;

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          body: JSON.stringify({ userInput }),
        });
        const { data } = await response.json();
        setDiseaseData(data);
      } catch (error) {
        console.error("Error fetching disease data:", error);
      }
    };

    fetchDiseaseData();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
      <Head>
        <title>MedCost - Results</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Results</h1>
        {diseaseData ? (
          <>
            <div className="mb-8">
              <div className="bg-transparent border-2 border-blue-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Disease Diagnosis</h2>
                <p className="text-lg text-white">{diseaseData.diagnosis || "Not available"}</p>
              </div>
            </div>
            <div className="mb-8">
              <div className="bg-transparent border-2 border-blue-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Recommended Hospitals</h2>
                <ul className="text-lg text-white">
                  {diseaseData.hospitals && diseaseData.hospitals.map((hospital, index) => (
                    <li key={index}>
                      {hospital.name} - {hospital.address}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mb-8">
              <div className="bg-transparent border-2 border-blue-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Potential Costs</h2>
                <ul className="text-lg text-white">
                  {diseaseData.costs && diseaseData.costs.map((cost, index) => (
                    <li key={index}>{cost}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="text-lg text-white text-center">Loading results...</p>
        )}
      </main>
    </div>
  );
}