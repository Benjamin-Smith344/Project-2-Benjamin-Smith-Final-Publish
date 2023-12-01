import * as React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const CustomHeader = () => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{
            width: 100,
            height: 50,
            margin: 10,
          }}
          source={require('./Assets/logo.png')}
        />
      </View>
    </View>
  );
}

export default CustomHeader;