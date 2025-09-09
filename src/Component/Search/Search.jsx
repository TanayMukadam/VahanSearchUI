import React from 'react'
import { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './Search.css'
function Search() {


	const [filter, setFilter] = useState("reg");
  const [query, setQuery] = useState("");


  
  const navigate = useNavigate();

  const onSearch = async (e) => {
    e.preventDefault();
    const payload = filter === "reg"
      ? { reg_no: query }
      : { phone_no: query };

    try {
      const response = await fetch("http://localhost:8000/results/get_result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Record not found");
      }
      const result = await response.json();

      // Choose reg_no from payload or result as key
      const regNo = result.regNo || payload.reg_no;

      // Navigate to dynamic results page with data in state
      navigate(`/${regNo}/results`, { state: { data: result, criteria: payload } });
    } catch (err) {
      alert("No record found. Please check your input.");
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
                <form className="search-card" onSubmit={onSearch} role="search" aria-label="Vahan search">
                  <div className="control control-select">
                    <label className="sr-only" htmlFor="filter">Search by</label>
                    <select
                      id="filter"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      aria-label="Search filter"
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
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Search query"
                    />
                  </div>
    
                  <div className="control control-button">
                    <button type="submit" className="btn-search login-btn" aria-label="Search">
                      <FaSearch aria-hidden="true" />
                      <span>Search</span>
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