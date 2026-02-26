import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function AuthHeader({ title, icon }) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 80, height: 80, marginBottom: 10 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name={icon} size={24} color="#2E86C1" />
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginLeft: 10
        }}>
          {title}
        </Text>
      </View>
    </View>
  );
}
