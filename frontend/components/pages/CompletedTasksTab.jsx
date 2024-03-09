import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../consts/colors';
import axios from 'axios';
import storage from '../../consts/storage';
import { Ionicons } from '@expo/vector-icons';
const CompletedTasksTab = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { token, user } = await storage.load({
      key: "userInfo"
    });
    const userId = user._id;
    try {
      const response = await axios({
        method: 'post',
        url: `http://10.0.2.2:3000/task/${userId}/All`,
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });
      if (response.data === 'token not verified' || response.data === 'failed to fetch task') {
        alert(response.data);
      }
      else {
        const d = response.data;
        const fin = d.filter((task) => task.status === 'completed');
        setTasks(fin);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          width: '100%',
          paddingHorizontal: 20,
          backgroundColor: colors.secondaryBgColor,
          height: 100,
          paddingBottom: 10,
          elevation: 4,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >Completed Tasks</Text>
        <Ionicons
          name="reload"
          size={24}
          color={colors.secondaryAccentColor}
          onPress={()=>fetchData()}
        />
      </View>
      <FlatList
        style={{
          width: '100%',
          paddingTop: 50,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center'
        }}
        data={tasks}
        renderItem={({ item }) => {
          return (
            <View
              style={[styles.task, { flexDirection: 'row' }]}
            >
              <Ionicons
                name="checkmark-done-circle-sharp"
                size={24}
                color="green" />
              <Text
                style={{
                  textDecorationLine: 'line-through',
                }}
              >{item.title}</Text>
            </View>
          )
        }}
        keyExtractor={(item) => item._id}
      />
    </View>
  )
}

export default CompletedTasksTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryBgColor,
  },
  task: {
    backgroundColor: colors.secondaryTertiaryColor,
    width: 300,
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 300,
    padding: 20,
    marginVertical: 15,
    borderRadius: 15,
    elevation: 4,

  },
});
