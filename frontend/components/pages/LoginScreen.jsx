import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import AuthContext from '../../contexts/authentication.js/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons'
import UserContext from '../../contexts/user/UserContext';
import axios from 'axios';
import storage from '../../consts/storage';


const LoginScreen = ({ navigation }) => {
  const { setAuthenticated } = useContext(AuthContext);
  const { loginData, setLoginData } = useContext(UserContext);

  const handleLogin = async () => {
    const { email, password } = loginData;
    if (email === '' || password === '') {
      alert("Please fill all the fields")
    }
    else if (!email.includes('@')) {
      alert('Invalid Email')
    }
    else {
      try {
        const response = await axios({
          method: "post",
          url: 'http://10.0.2.2:3000/login',
          data: {
            'email': email,
            'password': password
          }
        })
        if (response.data === "user not found" || response.data === "password incorrect") {
          alert(response.data);
        }
        else {
          try {
            await storage.save({
              "key" : "userInfo",
              "data" : response.data
            })
            setLoginData({
              email: '',
              password: ''
            })
            setAuthenticated(true);
          } catch (error) {
            console.log("async storage not working")
          }
        }
      } catch (error) {
        alert('Server Error');
      }
    }
  }

  const [showPass, setShowPass] = useState(false)
  return (
    <View style={styles.container}>
      <View
        style={styles.topcircle}
      />
      <View style={styles.loginbox}>
        <View>
          <Text
            style={styles.logintext}
          >Login To Your Account</Text>
        </View>
        <View>
          <TextInput
            placeholder='Email'
            style={styles.logintextfield}
            value={loginData.email}
            onChangeText={(text) => {
              setLoginData({ ...loginData, email: text });
            }}
          />
          <View
            style={styles.mypassfield}
          >
            <TextInput
              secureTextEntry={!showPass}
              placeholder='Password'
              value={loginData.password}
              onChangeText={(text) => {
                setLoginData({ ...loginData, password: text });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setShowPass(!showPass)
              }}
            >
              <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color='red' />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={styles.navtosignup}
        >
          <Text style={{ fontSize: 16 }}>New Here ? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('signup')
            }}
          >
            <Text style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: "red",
              borderBottomColor: 'red',
              borderBottomWidth: 2,
            }}>Signup Now </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.loginbtn}
            onPress={() => {
              handleLogin();
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe6e0',
  },
  topcircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'red',
    position: 'absolute',
    top: -100,
    transform: [{ scale: 2 }],
  },
  loginbox: {
    width: 300,
    height: 500,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loginbtn: {
    backgroundColor: 'red',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logintext: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logintextfield: {
    width: 200,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: '#dfe6e0',
    padding: 10,
  },
  navtosignup: {
    flexDirection: "row",
  },
  mypassfield: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: '#dfe6e0',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})