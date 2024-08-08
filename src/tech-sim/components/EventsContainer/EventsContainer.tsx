import React from 'react';
import './EventsContainer.css';

interface EventsContainerProps {
  events: string[];
}

const EventsContainer: React.FC<EventsContainerProps> = ({ events }) => {
  return (
    <div id="events-container">
      <div id="current-time">
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div id="events">
        <ul id="event-list">
          {events.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsContainer;