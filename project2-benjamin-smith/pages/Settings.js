// Dependencies
import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useFonts } from 'expo-font';
import * as Brightness from 'expo-brightness';

// Local imports
import { FontSizeContext, BrightnessContext, SoundEffectContext } from '../Context';

// StepperControl Component
const StepperControl = ({ value, onValueChange, min, max, step }) => {
  const handleIncrement = () => {
    if (value < max) {
      onValueChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onValueChange(value - step);
    }
  };

  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity onPress={handleDecrement}>
        <Text style={styles.stepperButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValueText}>{value}</Text>
      <TouchableOpacity onPress={handleIncrement}>
        <Text style={styles.stepperButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Settings Page
const Settings = () => {
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const { brightness, setBrightness } = useContext(BrightnessContext);
  const { soundIsEnabled, setSoundIsEnabled } = useContext(SoundEffectContext);
  
  const toggleSwitch = () => setSoundIsEnabled(previousState => !previousState);

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        Brightness.setSystemBrightnessAsync(brightness);
      }
    })();
  }, [brightness]);

  const [loaded] = useFonts({
    Trebuchet: require('../Assets/Fonts/trebuc.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const textStyle = {
    fontSize: fontSize,
    fontFamily: 'Trebuchet',
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlContainer}>
        <Text style={textStyle}>Font Size:</Text>
        <StepperControl
          value={fontSize}
          onValueChange={setFontSize}
          min={5}
          max={100}
          step={1}
        />
      </View>
      <View style={styles.controlContainer}>
        <Text style={textStyle}>Screen Brightness:</Text>
        <StepperControl
          value={brightness}
          onValueChange={setBrightness}
          min={0}
          max={100}
          step={10}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={textStyle}>Sound Effects:</Text>
        <Switch
          style={styles.switchStyle}
          trackColor={{ false: '#767577', true: '#767577' }}
          thumbColor={soundIsEnabled ? '#941a1d' : '#941a1d'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={soundIsEnabled}
        />
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '80%',
  },
  
  stepperContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  stepperValueText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchStyle: {
    marginRight: 20,
  },
});

export default Settings;
