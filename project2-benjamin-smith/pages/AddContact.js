//Dependencies.
import * as React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Local imports.
import { FontSizeContext } from '../Context';
import { SoundEffectContext } from '../Context';
import { ContactListContext } from '../Context';
import { IndexContext } from '../Context';

//Page.
const AddContact = ({ navigation, Settings }) => {
  const [loaded] = useFonts({
    Trebuchet: require('../Assets/Fonts/trebuc.ttf'),
  });
  //Obtaining font size from context.
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  //Sound effect toggle state.
  const { soundIsEnabled, setSoundIsEnabled } = useContext(SoundEffectContext);
  //Sound file use state.
  const [sound, setSound] = React.useState();
  //Contact list context useState hook.
  const { contactList, editContactList } = useContext(ContactListContext);

  //Text input usestate hooks.
  [employeName, setName] = useState('');
  [employeePosition, setPosition] = useState('');
  [employeeMobile, setMobile] = useState('');
  [employeeEmail, setEmail] = useState('');
  [employeeAddress, setAddress] = useState('');

  //Play sound function.
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../Assets/Sound-Effects/success_bell-6776.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  //Custom styling objects for dynamic font size.
  const nameOfContactStyle = {
    flex: 1,
    fontFamily: 'Trebuchet',
    marginLeft: '40%',
    fontSize: fontSize,
  };
  const detailStyle = { fontFamily: 'Trebuchet', fontSize: fontSize * 0.66 };
  const titleStyle = { fontFamily: 'Trebuchet', fontSize: fontSize * 0.33 };

  //Employee save function.
  const saveEmployees = async (newEmployees) => {
    try {
      await AsyncStorage.setItem('employees', JSON.stringify(newEmployees));
    } catch (error) {
      console.error('Error saving employees:', error);
    }
  };

  function saveHandler() {
    if (soundIsEnabled === true) {
      playSound();
    }
    const newEmployee = {
      name: employeName,
      position: employeePosition,
      mobile: employeeMobile,
      email: employeeEmail,
      address: employeeAddress,
    };
    const newContacts = [...contactList, newEmployee];
    editContactList(newContacts);
    saveEmployees(newContacts);
    Alert.alert('Contact Successfully Created!');
    navigation.navigate('Contact Page');
  }

  return (
    <ImageBackground 
      source={require('../Assets/Background.png')}
      style={styles.backgroundImage}
      >
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TextInput
              style={nameOfContactStyle}
              placeholder="Name"
              placeholderTextColor="white"
              onChangeText={(newName) => setName(newName)}></TextInput>
            <Image
              style={styles.editButton}
              source={require('../Assets/edit-icon.png')}
            />
          </View>
          <TextInput
            placeholder="Position"
            placeholderTextColor="white"
            onChangeText={(newPosition) => setPosition(newPosition)}></TextInput>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            onChangeText={(newMobile) => setMobile(newMobile)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(newEmail) => setEmail(newEmail)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={(newAddress) => setAddress(newAddress)}
          />
        </View>
        <View style={{ flexDirection: 'row-reverse' }}>
          <TouchableOpacity
            onPress={() => {
              saveHandler();
            }}>
            <Image
              style={{ width: 150, height: 150, margin: -20 }}
              source={require('../Assets/Save-Button.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

//Stylesheet for page.
const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white', 
    color: 'black', 
    borderWidth: 1,
    borderColor: '#ccc', 
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20, 
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: { flex: 1 },
  nameContainer: { flex: 0.2, alignItems: 'center', justifyContent: 'center' },
  editButton: {
    height: 50,
    width: 50,
    marginRight: '10%',
    margin: '3%',
    opacity: 0.6,
  },
  
  
});
export default AddContact;
