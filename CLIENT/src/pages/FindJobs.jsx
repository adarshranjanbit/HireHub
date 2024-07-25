/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import Wrapper from "../assets/wrappers/Job";
import "./JobListings.css";

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [place, setPlace] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10); // Number of jobs per page

  const searchForJobs = () => {
    setLoading(true);
    const apiUrl = "https://api.scrapingdog.com/indeed";
    const apiKey = "666fe381e2e88d70f5168059";
    const jobSearchUrl = `https://in.indeed.com/jobs?q=${jobType}&l=${place}`;

    const params = { api_key: apiKey, url: jobSearchUrl };

    axios
      .get(apiUrl, { params })
      .then((response) => {
        if (response.status === 200) {
          setJobs(response.data);
        } else {
          console.error(`Error: ${response.status}`);
          console.error(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error making the request:", error.message);
        setLoading(false);
      });
  };

  // Logic for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchForJobs();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <label htmlFor="jobType" style={{ marginRight: '10px' }} >Job Type:</label>
        <input
          type="text"
          id="jobType"
          name="jobType"
          value={jobType}
          style={{ marginTop: '10px' }}
          onChange={(e) => setJobType(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="place" >Location:</label>
        <input
          type="text"
          id="place"
          name="place"
          value={place}
          style={{ marginTop: '10px' }}
          onChange={(e) => setPlace(e.target.value)}
        />
      </div>
      <button 
      type="submit" 
      className="btn btn-block"
      style={{  width: '200px' ,  height: '37px' , marginTop: '20px' }}>
        Search
      </button>
    </div>
      </form>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div>
          <ul className="job-list">
            {currentJobs.map((job, index) => (
              <li key={index} className="job">
              
                <h2>{job.jobTitle}</h2>
                <p>{job.companyName}</p>
                <a href={job.jobLink} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="btn delete-btn"
                       style={{  color: 'white' }}>
                  Apply Job
                </a>
              </li>
            ))}
          </ul>
          {/* Pagination */}
          <ul className="pagination">
            {jobs.length > 0 &&
              Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }).map(
                (item, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      index + 1 === currentPage ? "active" : ""
                    }`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </li>
                )
              )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FindJobs;
