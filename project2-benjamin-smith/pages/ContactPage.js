//Dependencies
import * as React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Alert,
  ImageBackground,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Local imports.
import { FontSizeContext } from '../Context';
import { SoundEffectContext } from '../Context';
import { ContactListContext } from '../Context';
import { IndexContext } from '../Context';

//Page.
const ContactPage = ({ navigation }) => {
  const [loaded] = useFonts({
    Trebuchet: require('../Assets/Fonts/trebuc.ttf'),
  });

  useEffect((editContactList) => {
    // Load employees from AsyncStorage when the component mounts
    async () => {
      try {
        const savedContacts = await AsyncStorage.getItem('employees');
        if (savedContacts !== null) {
          editContactList(JSON.parse(savedContacts));
        }
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };
  }, []);

  //Sound effect toggle state.
  const { soundIsEnabled, setSoundIsEnabled } = useContext(SoundEffectContext);
  //Sound file use state.
  const [sound, setSound] = React.useState();
  //Contact list use state.
  const { contactList, editContactList } = useContext(ContactListContext);
  //Contact list idex use state.
  const { index, setIndex } = useContext(IndexContext);

  //Employee save function.
  const saveEmployees = async (newEmployees) => {
    try {
      await AsyncStorage.setItem('employees', JSON.stringify(newEmployees));
    } catch (error) {
      console.error('Error saving employees:', error);
    }
  };

  //Delete contact function.
  const deleteContact = (index) => {
    const contactListToEdit = [...contactList];
    contactListToEdit.splice(index, 1);
    editContactList(contactListToEdit);
    saveEmployees(contactListToEdit);
  };

  //Delete handler function.
  const deleteHandler = (index) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete ' + contactList[index].name + '?',
      [
        {
          text: 'Yes',
          onPress: () => deleteContact(index),
        },
        {
          text: 'No',
        },
      ]
    );
  };

  //Play sound function.
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../Assets/Sound-Effects/bubble-sound-43207.mp3')
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

  //On press handler.
  function onPressHandler(page, index) {
    if (soundIsEnabled === true) {
      playSound();
    }
    setIndex(index);
    navigation.navigate(page);
  }

  //Obtaining font size from context.
  const { fontSize, setFontSize } = useContext(FontSizeContext);

  const textStyle = {
    fontSize: fontSize,
    fontFamily: 'Trebuchet',
    margin: 10,
    flex: 1,
  };
  return (
     <ImageBackground 
      source={require('../Assets/Background.png')} // Make sure the path is correct
      style={styles.backgroundImage}
    >
      <View style={styles.mainContainer}>
        <FlatList
          data={contactList}
          renderItem={({ item, index }) => (
            <View>
              <TouchableOpacity
                style={styles.contactContainer}
                onPress={() => onPressHandler('View Contact', index)}>
                <Text style={textStyle}>{item.name}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteHandler(index)}>
                  <Image
                    style={styles.deleteButtonImage}
                    source={require('../Assets/remove-button.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.roundButton}>
          <TouchableOpacity onPress={() => onPressHandler('Add Contact')}>
            <Image
              style={styles.roundButtonImage}
              source={require('../Assets/Add-button.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

//Stylesheet for page.
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  mainContainer: {
    backgroundColor: '#fffff',
    flex: 1,
    flexDirection: 'column',
  },
  contactContainer: {
    flex: 0.1,
    backgroundColor: '#D9D9D9',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    margin: 10,
    position: 'absolute',
    bottom: -50,
    alignSelf: 'flex-end',
  },
  roundButtonImage: {
    width: 150,
    height: 150,
    margin: -20,
  },
  deleteButton: {
    margin: 10,
    marginRight: 10,
  },
  deleteButtonImage: {
    width: 30,
    height: 30,
    margin: 3,
  },
});
export default ContactPage;
