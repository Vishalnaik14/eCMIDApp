// hooks/useDateValidation.js
import { useState } from 'react';
import { Alert } from 'react-native';

export default function useDateValidation() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    // If end date exists and new start date is after end date, reset both dates
    if (endDate && date && new Date(date) > new Date(endDate)) {
      Alert.alert('Invalid Date', 'Start date cannot be after end date. Please select valid dates.');
      setStartDate(null);
      setEndDate(null);
      return;
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    // If start date exists and new end date is before start date, reset both dates
    if (startDate && date && new Date(date) < new Date(startDate)) {
      Alert.alert('Invalid Date', 'End date cannot be before start date. Please select valid dates.');
      setStartDate(null);
      setEndDate(null);
      return;
    }
    setEndDate(date);
  };

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return { 
    startDate, 
    endDate, 
    handleStartDateChange, 
    handleEndDateChange, 
    resetDates 
  };
}