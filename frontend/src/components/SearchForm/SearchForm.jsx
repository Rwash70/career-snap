import './SearchForm.css';

function SearchForm({ searchTerm, setSearchTerm }) {
  const handleSubmit = (e) => e.preventDefault(); // prevent reload

  return (
    <section className='search-form'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Search for jobs...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-input'
        />
      </form>
    </section>
  );
}

export default SearchForm;
