import { StyleSheet, View, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import ThemedText from './ThemedText'
import ThemedButton from './ThemedButton'

const ITEM_HEIGHT = 50
const VISIBLE_ITEMS = 5
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS

const ThemedTimePicker = ({ value, onTimeSelect, placeholder = "Select Time" }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedHour, setSelectedHour] = useState(9)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState('AM')

  const hourScrollRef = useRef(null)
  const minuteScrollRef = useRef(null)
  const periodScrollRef = useRef(null)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const periods = ['AM', 'PM']

  // Parse existing value when modal opens
  useEffect(() => {
    if (value && modalVisible) {
      const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i
      const match = value.match(timeRegex)
      if (match) {
        setSelectedHour(parseInt(match[1]))
        setSelectedMinute(parseInt(match[2]))
        setSelectedPeriod(match[3].toUpperCase())
      }
    }
  }, [modalVisible])

  const handleScroll = (event, type) => {
    const yOffset = event.nativeEvent.contentOffset.y
    const index = Math.round(yOffset / ITEM_HEIGHT)

    if (type === 'hour') {
      setSelectedHour(hours[index])
    } else if (type === 'minute') {
      setSelectedMinute(minutes[index])
    } else if (type === 'period') {
      setSelectedPeriod(periods[index])
    }
  }

  const scrollToIndex = (ref, index) => {
    ref.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    })
  }

  const handleConfirm = () => {
    const formattedTime = `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`
    onTimeSelect(formattedTime)
    setModalVisible(false)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  const renderPickerColumn = (data, selectedValue, onScroll, scrollRef) => {
    const getItemStyle = (item) => {
      const isSelected = item === selectedValue
      return [
        styles.pickerItem,
        isSelected && styles.selectedItem,
      ]
    }

    const getTextStyle = (item) => {
      const isSelected = item === selectedValue
      return [
        styles.pickerItemText,
        isSelected && styles.selectedItemText,
      ]
    }

    return (
      <View style={styles.pickerColumn}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={onScroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Padding at top */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
          
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={getItemStyle(item)}
              onPress={() => {
                scrollToIndex(scrollRef, index)
                if (data === hours) setSelectedHour(item)
                else if (data === minutes) setSelectedMinute(item)
                else setSelectedPeriod(item)
              }}
            >
              <ThemedText style={getTextStyle(item)}>
                {typeof item === 'number' ? item.toString().padStart(2, '0') : item}
              </ThemedText>
            </TouchableOpacity>
          ))}
          
          {/* Padding at bottom */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inputButton}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={value ? styles.inputText : styles.placeholderText}>
          {value || placeholder}
        </ThemedText>
        <ThemedText style={styles.icon}>🕐</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Time</ThemedText>

            <View style={styles.pickerContainer}>
              {/* Selection Indicator */}
              <View style={styles.selectionIndicator} />

              {/* Hour Picker */}
              {renderPickerColumn(
                hours,
                selectedHour,
                (e) => handleScroll(e, 'hour'),
                hourScrollRef
              )}

              <View style={styles.separator}>
                <ThemedText style={styles.separatorText}>:</ThemedText>
              </View>

              {/* Minute Picker */}
              {renderPickerColumn(
                minutes,
                selectedMinute,
                (e) => handleScroll(e, 'minute'),
                minuteScrollRef
              )}

              <View style={styles.separator} />

              {/* Period Picker */}
              {renderPickerColumn(
                periods,
                selectedPeriod,
                (e) => handleScroll(e, 'period'),
                periodScrollRef
              )}
            </View>

            <View style={styles.buttonContainer}>
              <ThemedButton onPress={handleCancel} style={styles.cancelButton}>
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </ThemedButton>
              <ThemedButton onPress={handleConfirm} style={styles.confirmButton}>
                <ThemedText style={styles.buttonText}>Confirm</ThemedText>
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ThemedTimePicker

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  icon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: PICKER_HEIGHT,
    position: 'relative',
    marginBottom: 20,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#007bff',
    zIndex: 1,
    pointerEvents: 'none',
  },
  pickerColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
  },
  scrollContent: {
    alignItems: 'center',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    // Styles handled by indicator overlay
  },
  pickerItemText: {
    fontSize: 18,
    color: '#999',
  },
  selectedItemText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  separator: {
    width: 20,
    height: PICKER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#666',
    paddingVertical: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
})