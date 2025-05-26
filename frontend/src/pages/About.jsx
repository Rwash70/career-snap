import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className='about-container'>
      <div className='about-content'>
        <header className='about-header'>
          <h1 className='main-heading'>About CareerSnap</h1>
          <p className='intro-text'>
            CareerSnap is a simple, user-friendly platform built to make remote
            job searching easier. Track, save, and discover remote roles that
            match your goals and preferences.
          </p>
        </header>

        <section className='about-section'>
          <h2 className='about-section__heading'>Our Mission</h2>
          <p>
            To simplify the remote job search with tools that help users explore
            and manage remote opportunities effectively.
          </p>
        </section>

        <section className='about-section'>
          <h2 className='about-section__heading'>Who CareerSnap is For</h2>
          <ul className='about-section__list'>
            <li className='about-section__list-item'>
              Recent graduates exploring flexible work
            </li>
            <li className='about-section__list-item'>
              Career changers moving into remote roles
            </li>
            <li className='about-section__list-item'>
              Professionals seeking work-life balance
            </li>
            <li className='about-section__list-item'>
              Anyone looking for location freedom
            </li>
          </ul>
        </section>

        <section className='about-section'>
          <h2 className='about-section__heading'>Key Features</h2>
          <ul className='about-section__list'>
            <li className='about-section__list-item'>
              Save remote jobs for later
            </li>
            <li className='about-section__list-item'>
              Get alerts for new postings
            </li>
            <li className='about-section__list-item'>
              Edit your job type preferences
            </li>
            <li className='about-section__list-item'>
              Search and filter remote-only jobs
            </li>
            <li className='about-section__list-item'>Secure password reset</li>
          </ul>
        </section>

        <section className='about-section'>
          <h2 className='about-section__heading'>Planned Features</h2>
          <ul className='about-section__list'>
            <li className='about-section__list-item'>
              Job application tracking
            </li>
            <li className='about-section__list-item'>
              Resume uploads with version control
            </li>
            <li className='about-section__list-item'>
              Custom job digest emails
            </li>
            <li className='about-section__list-item'>
              Job notes and reminders
            </li>
          </ul>
        </section>

        <section className='about-section'>
          <h2 className='about-section__heading'>Tone and Voice</h2>
          <ul className='about-section__list'>
            <li className='about-section__list-item'>Professional and clear</li>
            <li className='about-section__list-item'>
              Encouraging and focused
            </li>
            <li className='about-section__list-item'>
              User-friendly and time-conscious
            </li>
          </ul>
          <p className='about-section__note'>
            We aim to make your job search feel empowering, not overwhelming.
          </p>
        </section>

        <section className='about-section'>
          <h2 className='about-section__heading'>Branding</h2>
          <ul className='about-section__list'>
            <li className='about-section__list-item'>Logo: CareerSnap</li>
            <li className='about-section__list-item'>
              Colors: Orange and white
            </li>
            <li className='about-section__list-item'>
              Accent: Soft gradients for warmth
            </li>
            <li className='about-section__list-item'>
              Tone: Professional, modern, uplifting
            </li>
            <li className='about-section__list-item'>
              Slogan: "Find and track remote opportunities that fit your goals."
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
