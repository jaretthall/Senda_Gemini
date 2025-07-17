
import * as React from 'react';
import { SearchIcon, UserCircleIcon } from './icons.tsx';
import { MOCK_PATIENT_SEARCH_RESULTS } from '../../constants.tsx';

const PatientSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const filteredResults = MOCK_PATIENT_SEARCH_RESULTS.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={searchRef}>
      <label htmlFor="patient-search-input" className="sr-only">Search Patients by Name or MRN</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-secondary-400 dark:text-secondary-500" />
        </div>
        <input
          id="patient-search-input"
          type="text"
          placeholder="Search Patients (Name or MRN)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg leading-5 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
      {showResults && searchTerm && (
        <div className="absolute mt-1 w-full bg-white dark:bg-secondary-700 rounded-md shadow-lg z-20 border border-secondary-200 dark:border-secondary-600 max-h-60 overflow-y-auto">
          {filteredResults.length > 0 ? (
            <ul role="listbox" aria-label="Patient search results">
              {filteredResults.map(patient => (
                <li 
                  key={patient.id} 
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') alert(`Selected ${patient.name}`);}}
                  onClick={() => alert(`Selected ${patient.name}`)}
                  className="px-4 py-2 hover:bg-secondary-100 dark:hover:bg-secondary-600 cursor-pointer text-sm text-secondary-700 dark:text-secondary-200"
                >
                  <div className="flex items-center">
                    <UserCircleIcon className="w-5 h-5 mr-2 text-secondary-400" />
                    <div>
                      <div>{patient.name}</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">MRN: {patient.mrn}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-secondary-500 dark:text-secondary-400">No patients found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearchBar;