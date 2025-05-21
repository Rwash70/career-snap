import './JobCard.css';

function JobCard({ title, company, location, description }) {
  return (
    <div className='job-card'>
      <h3>{title}</h3>
      <p>Company: {company}</p>
      <p>Location: {location}</p>
      {description && <p>{description}</p>}
      <button>Apply</button>
    </div>
  );
}

export default JobCard;
