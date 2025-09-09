import React from 'react'
import { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './Search.css'

function Search() {
  const [filter, setFilter] = useState("reg");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const onSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Please login first");
      navigate('/');
      return;
    }

    const payload = filter === "reg"
      ? { reg_no: query }
      : { phone_no: query };

    try {
      const response = await fetch("http://localhost:8000/results/get_results", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ Inside headers object
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        alert("Session expired. Please login again.");
        navigate('/');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || "Record not found");
      }

      const result = await response.json();
      console.log('API Result:', result); // Debug log

      // Handle both single object and array responses
      const regNo = (Array.isArray(result) ? result[0]?.regNo : result?.regNo) || payload.reg_no;

      // Navigate to dynamic results page with data in state
      navigate(`/${regNo}/results`, { 
        state: { 
          data: Array.isArray(result) ? result : [result], 
          criteria: payload 
        } 
      });

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || "No record found. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-root">
      <div className="phone-frame" role="application" aria-label="Vahan check phone mockup">
        <div className="phone-inner">
          <header className="login-logo" aria-label="Site logo">
            <img className="login-logo-img" src="/public/images/logo.png" alt="CheckExplore Technologies" />
          </header>

          <main className="phone-main">
            <h1 className="title">VahanSearch</h1>
            <br />
            
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form className="search-card" onSubmit={onSearch} role="search" aria-label="Vahan search">
              <div className="control control-select">
                <label className="sr-only" htmlFor="filter">Search by</label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  aria-label="Search filter"
                  disabled={loading}
                >
                  <option value="reg">Reg No.</option>
                  <option value="phone">Phone No</option>
                </select>
              </div>

              <div className="control control-input">
                <label className="sr-only" htmlFor="query">Search query</label>
                <input
                  id="query"
                  type="text"
                  placeholder={
                    filter === "reg"
                      ? "Enter Registration Number"
                      : filter === "phone"
                      ? "Enter Phone Number"
                      : "Enter Owner Name"
                  }
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError("");
                  }}
                  aria-label="Search query"
                  disabled={loading}
                  required
                />
              </div>

              <div className="control control-button">
                <button type="submit" className="btn-search login-btn" aria-label="Search" disabled={loading}>
                  <FaSearch aria-hidden="true" />
                  <span>{loading ? "Searching..." : "Search"}</span>
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Search
