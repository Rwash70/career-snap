// src/components/Preloader/Preloader.jsx
import './Preloader.css';

function Preloader() {
  return (
    <div className='preloader'>
      <div className='spinner'></div>
      <p>Loading...</p>
    </div>
  );
}

export default Preloader;
