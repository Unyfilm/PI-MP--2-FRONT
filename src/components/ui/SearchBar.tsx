import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.scss';

/**
 * Props interface for SearchBar component.
 */
interface SearchBarProps {
  /** Current search query */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Callback when search query changes */
  onSearch?: (query: string) => void;
  /** Callback when search is submitted */
  onSubmit?: (query: string) => void;
  /** Whether the search bar is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show search suggestions */
  showSuggestions?: boolean;
  /** Array of search suggestions */
  suggestions?: string[];
  /** Callback when a suggestion is clicked */
  onSuggestionClick?: (suggestion: string) => void;
  /** Whether to clear search on escape */
  clearOnEscape?: boolean;
  /** Auto-focus the search input */
  autoFocus?: boolean;
}

/**
 * SearchBar component for movie search functionality.
 * Features modern design with search suggestions and keyboard navigation.
 * 
 * @component
 * @param {SearchBarProps} props - Component properties
 * @returns {JSX.Element} Search bar component
 * 
 * @example
 * ```tsx
 * <SearchBar 
 *   placeholder="Search movies..."
 *   onSearch={(query) => setSearchQuery(query)}
 *   onSubmit={(query) => performSearch(query)}
 *   suggestions={searchSuggestions}
 *   onSuggestionClick={(suggestion) => setSearchQuery(suggestion)}
 * />
 * ```
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  placeholder = 'Search movies...',
  onSearch,
  onSubmit,
  disabled = false,
  className = '',
  showSuggestions = true,
  suggestions = [],
  onSuggestionClick,
  clearOnEscape = true,
  autoFocus = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  /**
   * Updates the input value and calls the onSearch callback.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedSuggestionIndex(-1);
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  /**
   * Handles form submission.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    if (onSubmit && trimmedValue) {
      onSubmit(trimmedValue);
    }
  };

  /**
   * Handles input focus.
   */
  const handleFocus = () => {
    setIsFocused(true);
  };

  /**
   * Handles input blur.
   */
  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsFocused(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  };

  /**
   * Handles keyboard navigation.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else if (onSubmit) {
          onSubmit(inputValue.trim());
        }
        break;
      case 'Escape':
        if (clearOnEscape) {
          setInputValue('');
          if (onSearch) {
            onSearch('');
          }
        }
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  /**
   * Handles suggestion click.
   */
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSelectedSuggestionIndex(-1);
    setIsFocused(false);
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else if (onSearch) {
      onSearch(suggestion);
    }
  };

  /**
   * Clears the search input.
   */
  const handleClear = () => {
    setInputValue('');
    setSelectedSuggestionIndex(-1);
    
    if (onSearch) {
      onSearch('');
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Updates input value when prop changes.
   */
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  /**
   * Auto-focus the input if specified.
   */
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  /**
   * Scrolls selected suggestion into view.
   */
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedSuggestionIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedSuggestionIndex]);

  return (
    <div className={`search-bar ${className}`}>
      <form onSubmit={handleSubmit} className="search-bar__form">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">
            🔍
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="search-bar__input"
            aria-label="Search movies"
            aria-expanded={isFocused && suggestions.length > 0}
            aria-haspopup="listbox"
            role="combobox"
            autoComplete="off"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="search-bar__clear"
              aria-label="Clear search"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        {isFocused && showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="search-bar__suggestions"
            role="listbox"
            aria-label="Search suggestions"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={`search-bar__suggestion ${
                  index === selectedSuggestionIndex ? 'search-bar__suggestion--selected' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                role="option"
                aria-selected={index === selectedSuggestionIndex}
              >
                <span className="search-bar__suggestion-icon">🔍</span>
                <span className="search-bar__suggestion-text">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
