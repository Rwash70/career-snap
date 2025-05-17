import './SearchForm.css';

function SearchForm() {
  return (
    <section className='search-form'>
      <form>
        <input type='text' placeholder='Search for jobs...' />
        <button type='submit'>Search</button>
      </form>
    </section>
  );
}

export default SearchForm;
