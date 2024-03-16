import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../contexts/authentication.js/AuthContext';
import storage from '../../consts/storage';
import colors from '../../consts/colors';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';

const ProfileTab = () => {
  const { isAuthenticated, setAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [readonly, setReadonly] = useState(true);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [u_user, setU_User] = useState({
    _id: '',
    email: '',
    password: '',
    username: '',
  });
  useEffect(() => {
    handleLoad();
  }, []);

  // {"__v": 0, "_id": "65e828b2cd3ca727b70b8ab8", "createdAt": "2024-03-06T08:26:26.735Z", "email": "aryanfredricks@gmail.com", "password": "pass123", "username": "aryanf21"}

  const handleLoad = async () => {
    try {
      const { token, user } = await storage.load({
        key: "userInfo"
      });
      if (token && user) {
        setU_User({
          _id: user._id,
          email: user.email,
          password: user.password,
          username: user.username,
        })
      }
    } catch (error) {
      alert('Server Error');
    }
  }

  const handleUpdateUser = async () => {
    const { token } = await storage.load({
      key: "userInfo"
    });
    //validations:
    if (u_user.username === '' || u_user.password === '' || u_user.email === '') {
      alert('All fields are required');
    }
    else if (u_user.password.length < 5) {
      alert('Password must be atleast 5 characters long');
    }
    else if (!u_user.email.includes('@')) {
      alert('Invalid Email');
    }
    //request
    else {
      try {
        const response = await axios({
          url : `https://inotes-scaleup.up.railway.app/user/${u_user._id}`,
          method: 'put',
          data: {
            username: u_user.username,
            password: u_user.password,
          },
          headers: {
            Authorization: 'Bearer ' + token
          },
        })
        if(response.data.code ===400){
          alert(response.data.message)
        }
        else{
          alert('Information Updated Successfully');
          await storage.remove({key  : 'userInfo'});
          setAuthenticated(false);
        }
      } catch (error) {
        alert('JWT expired\nPlease Login Again');
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={{
        height: 500,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        <View>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white'
          }}>My Account</Text>
        </View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text
            style={{
              fontSize: 15,
              color: 'white'
            }}>
            Username
          </Text>
          <TextInput
            style={styles.textField}
            value={u_user.username}
            readOnly={readonly}
            onChangeText={(text) => {
              setU_User({
                ...u_user,
                username: text
              })
            }}
          />
        </View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text
            style={{
              fontSize: 15,
              color: 'white'
            }}>
            Password
          </Text>
          <TextInput
            style={styles.textField}
            value={u_user.password}
            readOnly={readonly}
            secureTextEntry={readonly}
            onChangeText={(text) => {
              setU_User({
                ...u_user,
                password: text
              })
            }}
          />
        </View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text
            style={{
              fontSize: 15,
              color: 'white'
            }}>
            Email
          </Text>
          <TextInput
            style={styles.textField}
            value={u_user.email}
            readOnly
            onChangeText={(text) => {
              setU_User({
                ...u_user,
                email: text
              })
            }}
          />
        </View>


        {/* edit button */}
        <View
          style={{
            width: 200,
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={styles.editbtn}
            onPress={(e) => {
              e.preventDefault();
              setShowConfirmButton(!showConfirmButton);
              setReadonly(!readonly);
            }}
          >
            <Entypo
              name={showConfirmButton ? 'cross' : 'edit'}
              color={'white'}
              size={19} />
          </TouchableOpacity>
          {
            showConfirmButton ?
              <TouchableOpacity
                style={styles.editbtn}
                onPress={(e) => {
                  e.preventDefault();
                  handleUpdateUser();
                  setReadonly(!readonly);
                  setShowConfirmButton(!showConfirmButton);
                }}
              >
                <Entypo name='check' color={'white'} size={18} />
              </TouchableOpacity> : null
          }
        </View>

        {/* logout btn */}
        <TouchableOpacity
          onPress={() => {
            storage.remove({
              key: "userInfo"
            });
            setAuthenticated(false);
          }}
          style={{
            backgroundColor: colors.secondaryAccentColor,
            padding: 10,
            borderRadius: 10,
            width: 250,
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: 'white'
          }}>Logout</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default ProfileTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryBgColor,
  },
  editbtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondaryAccentColor,
  },
  textField: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    margin: 10,
    padding: 10,
    backgroundColor: colors.primaryTertiaryColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryAccentColor,
  }
})