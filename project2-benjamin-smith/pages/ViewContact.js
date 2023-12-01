//Dependencies.
import * as React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
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
const ViewContact = ({ navigation }) => {
  const [loaded] = useFonts({
    Trebuchet: require('../Assets/Fonts/trebuc.ttf'),
  });
  //Obtaining font size from context.
  const { fontSize, setFontSize } = useContext(FontSizeContext);

  //Sound effect toggle state.
  const { soundIsEnabled, setSoundIsEnabled } = useContext(SoundEffectContext);
  //Sound file use state.
  const [sound, setSound] = React.useState();
  //Contact list use state.
  const { contactList, editContactList } = useContext(ContactListContext);
  //Contaxt list index use state.
  const { index, setIndex } = useContext(IndexContext);

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
  function onPressHandler(page) {
    if (soundIsEnabled === true) {
      playSound();
    }
    navigation.navigate(page);
  }

  //Custom styling objects for dynamic font size.
  const nameOfContactStyle = {
    flex: 1,
    fontFamily: 'Trebuchet',
    marginLeft: '33%',
    fontSize: fontSize,
    color: 'white',
  };
  const positionStyle = {
    color: 'white',
  };
  const detailStyle = { fontFamily: 'Trebuchet', fontSize: fontSize * 0.66 };
  const titleStyle = { fontFamily: 'Trebuchet', fontSize: fontSize * 0.33 };
  return (
    <ImageBackground 
      source={require('../Assets/Background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={nameOfContactStyle}>{contactList[index].name}</Text>
            <TouchableOpacity onPress={() => onPressHandler('Edit Contact')}>
              <Image
                style={styles.editButton}
                source={require('../Assets/edit-icon.png')}
              />
            </TouchableOpacity>
          </View>
          <Text style={positionStyle}>{contactList[index].position}</Text>
        </View>
        <View>
          <View style={styles.detailContainer}>
          <Text style={styles.displayBox}>{contactList[index].mobile}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.displayBox}>{contactList[index].email}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.displayBox}>{contactList[index].address}</Text>
        </View>
        </View>
      </View>
    </ImageBackground>
  );
};

//Stylesheet for page.
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: { flex: 1 },
  nameContainer: { flex: 0.2, alignItems: 'center', justifyContent: 'center' },
  detailContainer: { margin: 10, borderBottomWidth: 1 },
  editButton: { height: 50, width: 50, marginRight: '10%' },
  displayBox: {
    backgroundColor: 'white',  // White background
    color: 'black',            // Text color
    padding: 10,               // Padding inside the box
    borderRadius: 5,           // Rounded corners (optional)
    margin: 10,
  },
});

export default ViewContact;
