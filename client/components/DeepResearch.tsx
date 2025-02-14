"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { marked } from "marked";

interface ResearchResult {
  error?: string;
  messages?: string[];
  status?: string;
  agent?: string;
  children?: any[];
}

const DeepResearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setExecutionTime(null);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Research request failed");
      }

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error("Research failed:", error);
      setResults({ error: "Research failed. Please try again." });
    } finally {
      setExecutionTime((Date.now() - startTime) / 1000);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Deep Research Agent
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your research query..."
          className="flex-1 px-4 py-3 text-base text-black border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? "Researching..." : "Start Research"}
        </button>
      </form>

      {loading && (
        <div className="text-center my-8">
          <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Conducting research...</p>
        </div>
      )}

      {executionTime && (
        <div className="text-center text-gray-600 mb-4">
          Research completed in {executionTime.toFixed(2)} seconds
        </div>
      )}

      {results && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Research Results
          </h2>
          <div className="bg-white p-6 rounded-md overflow-x-auto">
            {results.error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded-md">
                {results.error}
              </div>
            ) : (
              <div className="text-black space-y-6">
                {results.messages?.slice(1).map((message, index) => (
                  <div
                    key={index}
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message),
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepResearch;
