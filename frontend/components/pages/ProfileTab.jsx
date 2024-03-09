import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import AuthContext from '../../contexts/authentication.js/AuthContext';
import storage from '../../consts/storage';
import colors from '../../consts/colors';


const ProfileTab = () => {
  const { isAuthenticated, setAuthenticated } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          storage.remove({
            key: "userInfo"
          });
          setAuthenticated(false);
        }}
        style={{
          backgroundColor: colors.primaryAccentColor,
          padding: 10,
          borderRadius: 5
        }}
      >
        <Text style={{
          color: 'white'
        }}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : colors.primaryBgColor,
  }
})