import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Services.css';

import comp1 from './comp1.png';
import comp2 from './comp2.png';
import comp3 from './comp3.png';
import comp4 from './comp4.png';
import comp5 from './comp5.png';
import comp6 from './comp6.png';
import comp7 from './comp7.png';
import comp8 from './comp8.png';

const API_BASE_URL = 'http://localhost:5000';

const Services = () => {
  const [activeSection, setActiveSection] = useState('candidates');
  const [searchQuery, setSearchQuery] = useState('');
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidateApplications, setCandidateApplications] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sectors, setSectors] = useState([]);

  const applyFormRef = useRef(null);

  useEffect(() => {
    fetchJobs();
    fetchFilters();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, filterLocation, filterSector, allJobs]);

  useEffect(() => {
    if (showApplyForm && applyFormRef.current) {
      applyFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showApplyForm]);

  const fetchJobs = async (retryCount = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching jobs from:', `${API_BASE_URL}/jobs`);
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched jobs:', data);
      setAllJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);

      if (retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        setTimeout(() => fetchJobs(retryCount + 1), 2000); // Retry after 2 seconds
      } else {
        let errorMessage = 'Failed to fetch jobs. ';
        if (error.message.includes('Failed to fetch')) {
          errorMessage += 'Please check your internet connection and ensure the server is running.';
        } else if (error.message.includes('HTTP error!')) {
          errorMessage += `Server responded with status: ${error.message.split(': ')[1]}.`;
        } else {
          errorMessage += 'An unexpected error occurred.';
        }
        errorMessage += ' Please try again later.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [locationsResponse, sectorsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/locations`),
        fetch(`${API_BASE_URL}/sectors`)
      ]);
      
      if (!locationsResponse.ok || !sectorsResponse.ok) {
        throw new Error('Failed to fetch filters');
      }
      
      const [locationsData, sectorsData] = await Promise.all([
        locationsResponse.json(),
        sectorsResponse.json()
      ]);
      
      setLocations(locationsData);
      setSectors(sectorsData);
    } catch (error) {
      console.error('Error fetching filters:', error);
      setError('Failed to fetch filters. Please try again later.');
    }
  };

  const filterJobs = () => {
    const filtered = allJobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.sector.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = !filterLocation || job.location === filterLocation;
      const matchesSector = !filterSector || job.sector === filterSector;

      return matchesSearch && matchesLocation && matchesSector;
    });
    setFilteredJobs(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationChange = (e) => {
    setFilterLocation(e.target.value);
  };

  const handleSectorChange = (e) => {
    setFilterSector(e.target.value);
  };

  const handleDetailsClick = (jobId) => {
    const job = filteredJobs.find(job => job.id === jobId);
    setSelectedJob(job);
    setActiveSection('jobDetails');
  };

  const handleBackToJobs = () => {
    setActiveSection('candidates');
    setSelectedJob(null);
    setShowApplyForm(false);
  };

  const handleApply = () => {
    setShowApplyForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    if (name === 'resume') {
      if (files[0] && files[0].type === 'application/pdf') {
        setFormData(prevState => ({
          ...prevState,
          [name]: files[0]
        }));
      } else {
        alert('Please upload a PDF file');
        event.target.value = '';
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    // Improved phone validation regex
    const phoneRegex = /^\+(\d{1,3})[-\s]?(\d{1,4})[-\s]?(\d{1,4})[-\s]?(\d{1,9})$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
  
    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    if (!formData.email.endsWith('@gmail.com')) {
      alert('Only Gmail addresses are allowed');
      setIsLoading(false);
      return;
    }
    if (!isValidPhone(formData.phone)) {
      alert('Please enter a valid phone number with country code');
      setIsLoading(false);
      return;
    }
  
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('phone', formData.phone);
      if (formData.resume) {
        formDataObj.append('resume', formData.resume);
      }
  
      const candidateResponse = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        body: formDataObj,
      });
  
      if (!candidateResponse.ok) {
        const errorData = await candidateResponse.json();
        throw new Error(errorData.error || 'Failed to create/update candidate');
      }
  
      const candidateData = await candidateResponse.json();
  
      const applicationResponse = await fetch(`${API_BASE_URL}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: selectedJob.id,
          email: formData.email,
        }),
      });
  
      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }
  
      alert('Application submitted successfully!');
      setShowApplyForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        resume: null,
      });
  
      fetchCandidateApplications(formData.email);
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.message.includes('Duplicate entry')) {
        alert('You have already applied for this job.');
      } else {
        alert(`Failed to submit application or already applied: ${error.message}`);
      }
      setError(`Failed to submit application: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandidateApplications = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${encodeURIComponent(email)}/applications`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidate applications');
      }
      const data = await response.json();
      setCandidateApplications(data);
    } catch (error) {
      console.error('Error fetching candidate applications:', error);
    }
  };

  const showCandidates = () => {
    setActiveSection('candidates');
  };

  const showCompanies = () => {
    setActiveSection('companies');
  };

  return (
    <section id="services">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Services
      </motion.h2>
      <section
        className="multiple-solutions"
        id="multiple-solutions"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2>For each profile, multiple solutions</h2>
        <p>We can help</p>
      </section>
      
      <div className="buttons-container">
        <button onClick={showCandidates}>For Candidates</button>
        <button onClick={showCompanies}>For Companies</button>
      </div>

      {activeSection === 'candidates' && (
        <section id="candidates">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Job Offers
          </motion.h2>
          <p>Discover your next professional challenge here</p>

          <div className="search-and-filter-container">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search jobs..." 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="filters">
              <select value={filterLocation} onChange={handleLocationChange}>
                <option value="">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
              <select value={filterSector} onChange={handleSectorChange}>
                <option value="">All Sectors</option>
                {sectors.map((sector, index) => (
                  <option key={index} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}

          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div>
                <h3>{job.title}</h3>
                <p><strong>Activity sector:</strong> {job.sector}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Publication Date:</strong> {job.date}</p>
              </div>
              <button onClick={() => handleDetailsClick(job.id)}>More details</button>
            </div>
          ))}

          {candidateApplications.length > 0 && (
            <div className="candidate-applications">
              <h3>Your Applications</h3>
              {candidateApplications.map((application) => (
                <div key={application.id} className="application-card">
                  <p><strong>Job Title:</strong> {application.title}</p>
                  <p><strong>Application Date:</strong> {application.application_date}</p>
                  <p><strong>Status:</strong> {application.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === 'companies' && (
        <section id="companies">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Associated Companies
          </motion.h2>
          <p>Here are some of the companies we work with:</p>
          <div className="company-logos">
            <img src={comp1} alt="Company 1" />
            <img src={comp2} alt="Company 2" />
            <img src={comp3} alt="Company 3" />
            <img src={comp4} alt="Company 4" />
            <img src={comp5} alt="Company 5" />
            <img src={comp6} alt="Company 6" />
            <img src={comp7} alt="Company 7" />
            <img src={comp8} alt="Company 8" />
          </div>
        </section>
      )}

      {activeSection === 'jobDetails' && selectedJob && (
        <section id="job-details">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedJob.title} Details
          </motion.h2>
          <div className="job-details">
            <p><strong>Activity sector:</strong> {selectedJob.sector}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Publication Date:</strong> {selectedJob.date}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Required Experience:</strong> {selectedJob.experience}</p>
            <div className="button-container">
              <button onClick={handleApply}>Apply</button>
              <button onClick={handleBackToJobs}>Back to Jobs</button>
            </div>
          </div>
          {showApplyForm && (
            <form ref={applyFormRef} className="apply-form" onSubmit={handleSubmit}>
              <h3>Apply for {selectedJob.title}</h3>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Please use gmail for reaching out'
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  placeholder='Provide with country code'
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Resume:
                <input 
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </section>
      )}
    </section>
  );
};

export default Services;