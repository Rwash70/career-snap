import { useState } from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import JobSearch from '../components/JobSearch/JobSearch';

export default function Jobs({ savedJobs, toggleSaveJob }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <JobSearch
        searchTerm={searchTerm}
        savedJobs={savedJobs}
        toggleSaveJob={toggleSaveJob}
      />
    </>
  );
}
