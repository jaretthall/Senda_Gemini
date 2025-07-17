
import * as React from 'react';
import { Patient } from '../../types.ts';
import { ChevronLeftIcon, ChevronRightIcon, UserCircleIcon, InformationCircleIcon } from '../common/icons.tsx';

interface CrisisPatientSliderProps {
  patients: Patient[];
}

const CrisisPatientSlider: React.FC<CrisisPatientSliderProps> = ({ patients }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextPatient = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % patients.length);
  };

  const prevPatient = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + patients.length) % patients.length);
  };

  React.useEffect(() => {
    if (patients.length <= 1) return;
    const timer = setInterval(nextPatient, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients.length, currentIndex]); // Added currentIndex to reset timer on manual nav


  if (!patients || patients.length === 0) {
    return <p className="text-center text-secondary-500 dark:text-secondary-400">No active crisis patients.</p>;
  }

  const patient = patients[currentIndex];

  return (
    <div 
      className="relative p-4 border border-danger-300 dark:border-danger-700 bg-danger-50 dark:bg-danger-900 rounded-lg min-h-[200px] flex flex-col justify-center"
      role="region"
      aria-roledescription="carousel"
      aria-label="Active Crisis Patients"
    >
      <div 
        id={`patient-slide-${currentIndex}`} 
        role="group"
        aria-roledescription="slide"
        aria-label={`Patient ${currentIndex + 1} of ${patients.length}: ${patient.name}`}
        className="flex items-center space-x-4"
      >
        <img 
          src={patient.photoUrl || `https://picsum.photos/seed/${patient.id}/80/80`} 
          alt={patient.name} 
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-danger-500"
        />
        <div>
          <h4 className="text-md md:text-lg font-semibold text-danger-700 dark:text-danger-200">{patient.name}</h4>
          <p className="text-xs md:text-sm text-danger-600 dark:text-danger-300">
            {patient.age} y.o. {patient.gender}, {patient.language} (MRN: {patient.mrn})
          </p>
          {patient.recentScreenerScores.map(score => (
            <p key={score.name} className="text-xs text-danger-600 dark:text-danger-300 mt-1">
              {score.name}: <span className="font-bold">{score.score}</span> (on {score.date})
            </p>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center text-danger-700 dark:text-danger-200">
        <InformationCircleIcon className="w-5 h-5 mr-2" aria-hidden="true"/>
        <p className="text-sm font-medium">Flagged: Critical Status</p>
      </div>

      {patients.length > 1 && (
        <>
          <button
            onClick={prevPatient}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-secondary-700 rounded-full shadow-md hover:bg-secondary-100 dark:hover:bg-secondary-600 text-danger-500"
            aria-label="Previous Patient"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextPatient}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-secondary-700 rounded-full shadow-md hover:bg-secondary-100 dark:hover:bg-secondary-600 text-danger-500"
            aria-label="Next Patient"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5" role="tablist" aria-label="Patient Slides">
            {patients.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-danger-500' : 'bg-danger-200 dark:bg-danger-700 hover:bg-danger-400'}`}
                aria-label={`Go to patient ${index + 1}: ${patients[index].name}`}
                aria-selected={currentIndex === index}
                role="tab"
              />
            ))}
          </div>
        </>
      )}
       <p className="absolute bottom-1 right-2 text-xs text-danger-500 dark:text-danger-400" aria-live="polite">
        {currentIndex + 1} / {patients.length}
      </p>
    </div>
  );
};

export default CrisisPatientSlider;