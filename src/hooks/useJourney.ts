import { useEffect, useState } from 'react';
import { journey } from '../data/site';

export function useJourney() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(journey.findIndex(section => section.id === entry.target.id));
      }
    }, { rootMargin: '-25% 0px -45% 0px' });
    journey.forEach(section => { const el = document.getElementById(section.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return active;
}
