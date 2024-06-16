"use client";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FidgetSpinner, LineWave, MutatingDots } from "react-loader-spinner";

export default function Home() {
  const [data, setData] = useState();

  if (data) {
    return <OutputPage data={data} />;
  } else {
    return <LandingPage setData={setData} />;
  }
}

const LandingPage = ({ setData }) => {
  const [symptoms, setSymptoms] = useState("");
  const [symptomList, setSymptomList] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (symptoms.trim() !== "") {
        setSymptomList([...symptomList, symptoms.trim()]);
        setSymptoms("");
      }
    }
  };

  const handleZipCodeKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (zipCode.trim() !== "") {
        setZipCode(zipCode.trim());
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
    setLoading(true);
    console.log("loading");
    const response = await fetch("/api/gemini/take-2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms: symptomList, location: zipCode }),
    });
    const { data } = await response.json();
    setLoading(false);
    setData(data);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <Head>
        <title>MediCost - Hospital Cost Estimator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading ? (
        <div className="flex flex-1 ">
          <div className="mx-auto my-auto flex">
          <LineWave color="#FFFFFF" secondaryColor="#FFFFFF"  />
            </div>
        </div>
      ) : (
        <main className="container mx-auto py-12 px-4">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="MedCost Logo"
              width={200}
              height={200}
            />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-center text-white">
            MediCost
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
              <input
                id="zipCode"
                type="text"
                placeholder="Zip Code"
                className="w-full md:w-1/4 p-4 text-lg text-white border-4 bg-transparent border-blue-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-8"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onKeyPress={handleZipCodeKeyPress}
              />
              <div className="absolute inset-y-0 left-80 flex items-center pr-6"></div>
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
        </main>
      )}
    </div>
  );
};

const OutputPage = ({ data }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center p-4 md:p-8"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Results</h1>
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(data).map(([category, values], index) => (
            <div
              key={category}
              className="bg-transparent rounded-lg shadow-lg p-6 border-2 border-blue-500"
            >
              <h2 className="text-2xl font-bold mb-2 text-white">
                Disease {index + 1}
              </h2>
              <h3 className="text-xl font-bold mb-4 text-blue-200">
                {category}
              </h3>
              <ul className="list-disc pl-6 text-white grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <li key={index} className="mb-1">
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
