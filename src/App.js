import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("content/news");
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/scrape-online-khabar/`,
        {
          params: {
            category: selectedCategory,
          },
        }
      );
      setNews(response.data.news);
      setUpdatedAt(new Date());
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData();
    }, 1 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedCategory]); // Include selectedCategory in the dependency array

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 p-4 text-white">
        <img src={logo} className="h-8" alt="logo" />
        <p className="text-lg font-bold">Your App Name</p>
      </header>

      <div className="flex mb-4 p-5">
        <h2
          onClick={() => setSelectedCategory("content/news")}
          className={`text-2xl font-semibold mr-4 rounded cursor-pointer py-2 px-4 ${
            selectedCategory === "content/news"
              ? "bg-blue-200 border border-blue-500"
              : "hover:bg-blue-100"
          }`}
        >
          Latest News
        </h2>
        <h2
          onClick={() => setSelectedCategory("business")}
          className={`text-2xl font-semibold mr-4 rounded cursor-pointer py-2 px-4 ${
            selectedCategory === "business"
              ? "bg-blue-200 border border-blue-500"
              : "hover:bg-blue-100"
          }`}
        >
          Business
        </h2>
        <h2
          onClick={() => setSelectedCategory("sports")}
          className={`text-2xl font-semibold rounded cursor-pointer py-2 px-4 ${
            selectedCategory === "sports"
              ? "bg-blue-200 border border-blue-500"
              : "hover:bg-blue-100"
          }`}
        >
          Sport
        </h2>
        <div className="flex font-semibold text-sm p-4">
          <span className="flex text-center">UpdatedAt:</span>
          <span className="flex text-center">
            {updatedAt && updatedAt.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Loader section */}
      {loading && (
        <div className="flex justify-center items-center text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-t-blue-500 border-r-blue-500"></div>
        </div>
      )}

      {/* News Content Section */}
      <section className="container mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black"
            >
              <div className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.contents}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mt-2"
                >
                  Read more
                </a>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
