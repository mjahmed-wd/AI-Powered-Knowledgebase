'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAllTagsSimple, createTag } from '@/services/tagService';
import { Tag } from '@/types/api';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  placeholder = "Search or create tags...",
  className = ""
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true);
        const tags = await getAllTagsSimple();
        setAllTags(tags);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

  // Filter tags based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredTags([]);
      return;
    }

    const filtered = allTags.filter(tag => 
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some(selectedTag => selectedTag.id === tag.id)
    );

    setFilteredTags(filtered);
  }, [inputValue, allTags, selectedTags]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setInputValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsDropdownOpen(value.length > 0);
  };

  const handleInputFocus = () => {
    if (inputValue.trim()) {
      setIsDropdownOpen(true);
    }
  };

  const handleTagSelect = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setInputValue('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id));
  };

  const handleCreateTag = async () => {
    const tagName = inputValue.trim();
    if (!tagName || isCreating) return;

    // Check if tag already exists
    const existingTag = allTags.find(tag => 
      tag.name.toLowerCase() === tagName.toLowerCase()
    );
    
    if (existingTag) {
      handleTagSelect(existingTag);
      return;
    }

    try {
      setIsCreating(true);
      const newTag = await createTag({ name: tagName });
      
      // Update local state
      setAllTags(prev => [...prev, newTag]);
      onTagsChange([...selectedTags, newTag]);
      setInputValue('');
      setIsDropdownOpen(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to create tag:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (filteredTags.length > 0) {
        handleTagSelect(filteredTags[0]);
      } else if (inputValue.trim()) {
        handleCreateTag();
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleTagRemove(selectedTags[selectedTags.length - 1]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setInputValue('');
    }
  };

  const shouldShowCreateOption = inputValue.trim() && 
    !filteredTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) &&
    !selectedTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase());

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 min-h-[44px] bg-white">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={selectedTags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-3 py-2 text-gray-500 text-center">Loading tags...</div>
            ) : (
              <>
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{tag.name}</span>
                      <span className="text-xs text-gray-500">Existing</span>
                    </div>
                  </button>
                ))}
                
                {shouldShowCreateOption && (
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    disabled={isCreating}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-t border-gray-200 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600">
                        {isCreating ? `Creating "${inputValue}"...` : `Create "${inputValue}"`}
                      </span>
                      <span className="text-xs text-blue-500">New</span>
                    </div>
                  </button>
                )}
                
                {filteredTags.length === 0 && !shouldShowCreateOption && inputValue.trim() && (
                  <div className="px-3 py-2 text-gray-500 text-center">
                    No tags found
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
