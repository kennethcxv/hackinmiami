"use client";
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [symptoms, setSymptoms] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/estimate-cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });
    const data = await response.json();
    setEstimatedCost(data.estimatedCost);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Hospital Cost Estimator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-blue-900">Hospital Cost Estimator</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="symptoms" className="block mb-2 font-medium text-blue-900">
            Enter your symptoms:
          </label>
          <textarea
            id="symptoms"
            rows="4"
            className="w-full p-2 mb-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Estimate Cost
          </button>
        </form>
        {estimatedCost && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2 text-blue-900">Estimated Hospital Cost</h2>
            <p className="text-blue-900">{estimatedCost}</p>
          </div>
        )}
      </main>
    </div>
  );
}