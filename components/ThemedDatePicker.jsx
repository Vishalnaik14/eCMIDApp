import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Modal, ScrollView } from 'react-native'
import ThemedView from './ThemedView'
import ThemedText from './ThemedText'

const ThemedDatePicker = ({ value, onDateChange, label = "Date of Birth" }) => {
  const [show, setShow] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date())
  const [selectedDate, setSelectedDate] = useState(value)

  const formatDate = (date) => {
    if (!date) return 'Select Date'
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Generate years from 1900 to current year (reasonable birth date range)
  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year)
    }
    return years
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  const generateCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
    const days = []
    
    // Previous month's days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)
    const prevMonthDays = prevMonth.getDate()
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i)
      })
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      })
    }
    
    // Next month's days
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i)
      })
    }
    
    return days
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    const today = new Date()
    
    // Only allow navigation if next month doesn't exceed current date
    if (nextMonth <= today) {
      setCurrentMonth(nextMonth)
    }
  }

  const handleYearSelect = (year) => {
    const newDate = new Date(year, currentMonth.getMonth(), 1)
    const today = new Date()
    
    // Validate: ensure the new date doesn't exceed today
    if (newDate > today) {
      // If selecting current year, adjust to current month if needed
      if (year === today.getFullYear() && currentMonth.getMonth() > today.getMonth()) {
        setCurrentMonth(new Date(year, today.getMonth(), 1))
      } else {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
      }
    } else {
      setCurrentMonth(newDate)
    }
    
    setShowYearPicker(false)
  }

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1)
    const today = new Date()
    
    // Validate: ensure the new month doesn't exceed today's date
    if (newDate > today) {
      return // Don't allow selection of future months
    }
    
    setCurrentMonth(newDate)
    setShowMonthPicker(false)
  }

  const handleDateSelect = (dateObj) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDateObj = new Date(dateObj.date)
    selectedDateObj.setHours(0, 0, 0, 0)
    
    // Validation 1: Don't allow future dates
    if (selectedDateObj > today) {
      return
    }
    
    // Validation 2: Reasonable birth date (not more than 150 years ago)
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 150)
    if (selectedDateObj < minDate) {
      alert('Please select a valid birth date')
      return
    }
    
    setSelectedDate(dateObj.date)
    onDateChange(dateObj.date)
    setShow(false)
  }

  const isDateDisabled = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    // Disable future dates
    if (checkDate > today) return true
    
    // Disable dates more than 150 years old
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 150)
    if (checkDate < minDate) return true
    
    return false
  }

  const isMonthDisabled = (monthIndex) => {
    const testDate = new Date(currentMonth.getFullYear(), monthIndex, 1)
    const today = new Date()
    
    // Disable if the month is in the future
    return testDate > today
  }

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    const check = new Date(date)
    return selected.toDateString() === check.toDateString()
  }

  const isToday = (date) => {
    const today = new Date()
    const check = new Date(date)
    return today.toDateString() === check.toDateString()
  }

  const canGoNext = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    const today = new Date()
    return nextMonth <= today
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>{label}:</ThemedText>
      
      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.dateText}>
          {selectedDate ? formatDate(selectedDate) : 'Select Date'}
        </ThemedText>
      </TouchableOpacity>

      <Modal
        visible={show}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShow(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShow(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.calendarContainer}>
              {/* Header with clickable month and year */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
                  <ThemedText style={styles.monthYearClickable}>
                    {monthNames[currentMonth.getMonth()]} 
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowYearPicker(true)}>
                  <ThemedText style={styles.monthYearClickable}>
                    {currentMonth.getFullYear()}
                  </ThemedText>
                </TouchableOpacity>
                <View style={styles.navigationButtons}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                    <ThemedText style={styles.navButtonText}>‹</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleNextMonth} 
                    style={[styles.navButton, !canGoNext() && styles.navButtonDisabled]}
                    disabled={!canGoNext()}
                  >
                    <ThemedText style={[styles.navButtonText, !canGoNext() && styles.navButtonTextDisabled]}>›</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Year Picker Modal */}
              {showYearPicker && (
                <View style={styles.pickerOverlay}>
                  <View style={styles.pickerHeader}>
                    <ThemedText style={styles.pickerTitle}>Select Year</ThemedText>
                    <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                      <ThemedText style={styles.pickerClose}>✕</ThemedText>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={true}>
                    {generateYears().map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.pickerItem,
                          year === currentMonth.getFullYear() && styles.pickerItemSelected
                        ]}
                        onPress={() => handleYearSelect(year)}
                      >
                        <ThemedText style={[
                          styles.pickerItemText,
                          year === currentMonth.getFullYear() && styles.pickerItemTextSelected
                        ]}>
                          {year}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Month Picker Modal */}
              {showMonthPicker && (
                <View style={styles.pickerOverlay}>
                  <View style={styles.pickerHeader}>
                    <ThemedText style={styles.pickerTitle}>Select Month</ThemedText>
                    <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                      <ThemedText style={styles.pickerClose}>✕</ThemedText>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {monthNames.map((month, index) => {
                      const disabled = isMonthDisabled(index)
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.pickerItem,
                            index === currentMonth.getMonth() && styles.pickerItemSelected,
                            disabled && styles.pickerItemDisabled
                          ]}
                          onPress={() => handleMonthSelect(index)}
                          disabled={disabled}
                        >
                          <ThemedText style={[
                            styles.pickerItemText,
                            index === currentMonth.getMonth() && styles.pickerItemTextSelected,
                            disabled && styles.pickerItemTextDisabled
                          ]}>
                            {month}
                          </ThemedText>
                        </TouchableOpacity>
                      )
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Day names */}
              <View style={styles.dayNamesRow}>
                {dayNames.map((day, index) => (
                  <View key={index} style={styles.dayNameCell}>
                    <ThemedText style={styles.dayName}>{day}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Calendar grid */}
              <View style={styles.calendarGrid}>
                {generateCalendarDays().map((dateObj, index) => {
                  const disabled = isDateDisabled(dateObj.date)
                  const selected = isDateSelected(dateObj.date)
                  const todayDate = isToday(dateObj.date)

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayCell,
                        selected && styles.selectedDay,
                        todayDate && !selected && styles.todayDay
                      ]}
                      onPress={() => handleDateSelect(dateObj)}
                      disabled={disabled}
                    >
                      <ThemedText
                        style={[
                          styles.dayText,
                          !dateObj.isCurrentMonth && styles.otherMonthDay,
                          disabled && styles.disabledDay,
                          selected && styles.selectedDayText,
                          todayDate && !selected && styles.todayDayText
                        ]}
                      >
                        {dateObj.day}
                      </ThemedText>
                    </TouchableOpacity>
                  )
                })}
              </View>

              {/* Close button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShow(false)}
              >
                <ThemedText style={styles.closeButtonText}>Close</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  )
}

export default ThemedDatePicker

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateButton: {
    padding: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYearClickable: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginRight: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 24,
    color: '#000',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    zIndex: 10,
    padding: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  pickerClose: {
    fontSize: 24,
    color: '#666',
  },
  pickerScroll: {
    maxHeight: 300,
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  pickerItemDisabled: {
    opacity: 0.3,
  },
  pickerItemText: {
    fontSize: 16,
    color: '#000',
  },
  pickerItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerItemTextDisabled: {
    color: '#ccc',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayNameCell: {
    width: 40,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#000',
  },
  otherMonthDay: {
    color: '#ccc',
  },
  disabledDay: {
    color: '#e0e0e0',
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  todayDay: {
    backgroundColor: '#e3f2fd',
  },
  todayDayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})