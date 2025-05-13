"use client";
import { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import Sidebar from "./Sidebar";
import Chatbox from "./Chatbox";

export default function Models() {
  const [models, setModels] = useState<
    { name: string; displayName?: string }[]
  >([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<{
    name: string;
    displayName?: string;
  } | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Dropdown Model
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isModelDropdownOpen &&
        !(e.target as HTMLElement).closest(".model-dropdown")
      ) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModelDropdownOpen]);

  const handleSelectModel = (model: { name: string; displayName?: string }) => {
    setSelectedModel(model);
    localStorage.setItem("selectedModel", model.name);
    console.log(`Selected model: ${model.displayName || model.name}`);
  };

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true);
      try {
        const res = await fetch("/api/models");
        if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);
        const data = await res.json();

        if (data.models && Array.isArray(data.models)) {
          setModels(data.models);

          const savedModel = localStorage.getItem("selectedModel");
          if (savedModel) {
            const foundModel = data.models.find(
              (m: any) => m.name === savedModel
            );
            setSelectedModel(foundModel ?? data.models[0]);
          } else {
            setSelectedModel(data.models[0]);
          }
        } else {
          setModelError("Invalid models data format");
        }
      } catch (error: any) {
        console.error("Error fetching models:", error);
        setModelError(error.message);
      } finally {
        setIsLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  return (
    <>
      <div className="px-3 py-2">
        <h3 className="text-xs text-gray-400 uppercase font-medium mb-2 px-1">
          AI Model
        </h3>

        {isLoadingModels ? (
          <div className="text-center py-2 text-gray-400 text-sm italic">
            Loading models...
          </div>
        ) : modelError ? (
          <div className="text-center py-2 text-red-400 text-sm">
            Error: {modelError}
          </div>
        ) : models.length > 0 ? (
          <div className="relative model-dropdown">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center justify-between w-full py-2 px-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors text-left"
            >
              <span className="truncate text-sm">
                {selectedModel?.displayName ||
                  selectedModel?.name ||
                  "Choose Model"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isModelDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isModelDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700 max-h-48 overflow-y-auto">
                {models.map((model) => (
                  <div
                    key={model.name}
                    onClick={() => {
                      handleSelectModel(model);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between py-2 px-3 cursor-pointer transition-colors ${
                      selectedModel?.name === model.name
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <span className="truncate text-sm">
                      {model.displayName || model.name}
                    </span>
                    {selectedModel?.name === model.name && (
                      <AiOutlineCheck className="text-white" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2 text-gray-400 text-sm italic">
            No models available
          </div>
        )}
      </div>

      <Sidebar selectedModel={selectedModel} />
      <Chatbox selectedModel={selectedModel} />
    </>
  );
}
