import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import AuthContext from '../../contexts/authentication.js/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons'
import UserContext from '../../contexts/user/UserContext';
import axios from 'axios';
const SignupScreen = ({ navigation }) => {
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const { signupData, setSignupData } = useContext(UserContext);

  const handleSignup = async () => {
    const { email, username, password, confirmPassword } = signupData;
    if (email === '' || username === '' || password === '' || confirmPassword === '') {
      alert('All fields are required')
    }
    else if (password !== confirmPassword) {
      alert('Passwords do not match')
    }
    else {
      try {
        const response = await axios({
          method: 'post',
          url: "http://10.0.2.2:3000/signup",
          data: {
            'email': email,
            'username': username,
            'password': password
          }
        })
        if (response.data === 'user exists' || response.data === 'minimum 5 charachters required') {
          alert('User with this email/username already exists')
        }
        else {
          alert('Account Created Successfully')
          navigation.replace('login')
        }
      } catch (error) {
        console.log(error.status)
      }
    }
  }
  return (
    <View style={styles.container}>
      <View
        style={styles.topcircle}
      />
      <View style={styles.loginbox}>
        <View>
          <Text
            style={styles.logintext}
          >Create Your Account</Text>
        </View>
        <View>
          <TextInput
            placeholder='Email'
            style={styles.logintextfield}
            value={signupData.email}
            onChangeText={(val) => {
              setSignupData(
                {
                  ...signupData,
                  email: val
                }
              )
            }}
          />
          <TextInput
            placeholder='Username'
            style={styles.logintextfield}
            value={signupData.username}
            onChangeText={(val) => {
              setSignupData(
                {
                  ...signupData,
                  username: val
                }
              )
            }}
          />
          <View
            style={styles.mypassfield}
          >
            <TextInput
              onChangeText={(val) => {
                setSignupData(
                  {
                    ...signupData,
                    password: val
                  }
                )
              }}
              value={signupData.password}
              style={{ maxWidth: 155, }}
              secureTextEntry={!showPass}
              placeholder='Password' />
            <TouchableOpacity
              onPress={() => {
                setShowPass(!showPass)
              }}
            >
              <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color='red' />
            </TouchableOpacity>
          </View>
          <View
            style={styles.mypassfield}
          >
            <TextInput
              value={signupData.confirmPassword}
              onChangeText={(val) => {
                setSignupData(
                  {
                    ...signupData,
                    confirmPassword: val
                  }
                )
              }}
              style={{ maxWidth: 155, width: 155 }}
              secureTextEntry={!showPass2}
              placeholder='Confirm Password' />
            <TouchableOpacity
              onPress={() => {
                setShowPass2(!showPass2)
              }}
            >
              <Ionicons name={showPass2 ? 'eye-off' : 'eye'} size={20} color='red' />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={styles.navtosignup}
        >
          <Text style={{ fontSize: 16 }}>Existing User? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('login')
            }}
          >
            <Text style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: "red",
              borderBottomColor: 'red',
              borderBottomWidth: 2,
            }}>Login Now </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.loginbtn}
            onPress={() => {
              handleSignup();
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default SignupScreen

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
    maxWidth: 200
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
    alignItems: 'center',
    maxWidth: 200
  }
})