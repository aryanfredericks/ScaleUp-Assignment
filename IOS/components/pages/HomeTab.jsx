import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import colors from '../../consts/colors';
import storage from '../../consts/storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import TaskContext from '../../contexts/tasks/TaskContext';

const HomeTab = ({ navigation }) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [taskName, setTaskName] = useState('All');
  const [addTaskName, setAddTaskName] = useState('Common');
  const [addtaskTitle, setAddTaskTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [searchTaskTitle, setSearchTaskTitle] = useState('');
  const {myTrigger , setMyTrigger} =useContext(TaskContext);

  useEffect(() => {
    fetchTasks();
  }, [trigger])

  const fetchTasks = async () => {
    const { token, user } = await storage.load({
      key: "userInfo"
    })
    const userId = user._id;
    try {
      const response = await axios({
        method: 'post',
        url: `https://inotes-scaleup.up.railway.app/task/${userId}/${taskName}`,
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });
      if (response.data === 'token not verified' || response.data === 'failed to fetch task') {
        alert(response.data);
      }
      else {
        const d = response.data;
        const fin = d.filter((task) => task.status === 'pending');
        setTasks(fin);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closeBottomSheet = () => {
    setBottomSheetVisible(false)
  }

  const handleEdit = async () => {
    try {
      const { token, user } = await storage.load({
        key: "userInfo"
      })
      const response = await axios({
        method: 'post',
        url: `https://inotes-scaleup.up.railway.app/edit-task/${editingTaskId}`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: {
          "title": addtaskTitle,
          "category": addTaskName,
        }
      })
      if (response.data === 'token not verified' || response.data === 'failed to update task') {
        alert(response.data);
      }
      else {
        alert('Task Updated');
        setTrigger(!trigger);
        setBottomSheetVisible(false);
        setIsEdit(false);
        setAddTaskTitle('');
        setAddTaskName('Common');
        setEditingTaskId('');
      }
    } catch (error) {
      alert("JWT Token Error,\nPlease Login Again!");
    }
  }

  const handleAddTask = async () => {
    try {
      const { token, user } = await storage.load({
        key: "userInfo"
      })
      const userId = user._id;
      const response = await axios.post(
        `https://inotes-scaleup.up.railway.app/task/${userId}`,
        {
          "title": addtaskTitle,
          "category": addTaskName,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        }
      );
      if (response.data === 'token not verified' || response.data === 'failed to save task') {
        alert(response.data);
      }
      else {
        setAddTaskTitle('');
        setAddTaskName('Common');
        setTrigger(!trigger);
        setBottomSheetVisible(false);
      }
    } catch (error) {
      console.log(error);
      alert("JWT Token Error,\nPlease Login Again!");
    }
  }


  const handleSearch = async () => {
    if (searchTaskTitle === '') {
      fetchTasks();
      return;
    }
    const { token, user } = await storage.load({
      key: "userInfo"
    })
    const userId = user._id;
    try {
      const response = await axios({
        method: 'post',
        url: `https://inotes-scaleup.up.railway.app/search-task/${userId}/${searchTaskTitle}`,
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
      if (response.data === 'token not verified' || response.data === 'failed to fetch tasks') {
        alert(response.data);
      }
      else {
        setTasks(response.data);
      }
    } catch (error) {
      alert("JWT Token Error,\nPlease Login Again!");
    }
  }


  const handleCompleteTask = async (taskId) => {
    const { token } = await storage.load({
      key: "userInfo"
    })
    try {
      const response = await axios({
        method: 'post',
        url: `https://inotes-scaleup.up.railway.app/set-completed/${taskId}`,
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
      if (response.data === 'failed to update task' || response.data === 'token not verified') {
        alert(response.data);
      }
      else {
        alert('Task Completed');
        setTrigger(!trigger);
        setMyTrigger(!myTrigger);
      }
    } catch (error) {
      alert("JWT Token Error,\nPlease Login Again!");
    }
  }


  const handleDeleteTask = async (taskId) => {
    const { token } = await storage.load({
      key: "userInfo"
    })
    try {
      const response = await axios({
        method: 'delete',
        url: `https://inotes-scaleup.up.railway.app/task/${taskId}`,
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });
      if (response.data === 'token not verified' || response.data === 'failed to delete task') {
        alert(response.data);
      }
      else {
        alert('Task Deleted');
        setTrigger(!trigger);
      }
    } catch (error) {
      alert("JWT Token Error,\nPlease Login Again!");
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.searchbar}>
        <TextInput
          placeholder='Search'
          placeholderTextColor='grey'
          style={{ flex: 1, color: 'white' }}
          value={searchTaskTitle}
          onChangeText={(text) => {
            if (text === '') {
              setTrigger(!trigger);
            }
            setSearchTaskTitle(text)
          }}
        />
        <Ionicons
          name='search-outline'
          size={23}
          color={colors.secondaryAccentColor}
          onPress={() => {
            handleSearch();
          }}
        />
      </View>

      <View style={styles.taskcontainer}>
        <View style={styles.functions}>
          <View style={styles.filtersbtn}>
            <Picker
              selectedValue={taskName}
              onValueChange={(itemValue, itemIndex) => {
                setTaskName(itemValue)
                setTrigger(!trigger);
              }}
              style={{ color: 'white', width: 150, height: 30 }}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Sport" value="Sport" />
              <Picker.Item label="Urgent" value="Urgent" />
              <Picker.Item label="Common" value="Common" />
            </Picker>
          </View>
          <TouchableOpacity
            onPress={() => {
              setBottomSheetVisible(true)
            }}
            style={styles.opensheetbtn}
          >
            <Text style={{ fontSize: 15 }}>Add Task</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tasks}>
          {
            tasks.length === 0 ?
              <Text>No Task Found</Text> :
              <FlatList
                style={{
                  width: '100%',
                  flex: 1,
                }}
                data={tasks}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                renderItem={({ item }) => (
                  <View style={styles.task}>
                    <View style={styles.dueAt}>
                      <Text
                        style={{
                          color: colors.secondaryAccentColor,
                          fontSize: 12,
                          padding: 5,
                          fontWeight: '700',
                        }}
                      > Due at: {item.dueAt}</Text>
                    </View>
                    <View style={styles.category}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          paddingHorizontal: 13,
                          paddingVertical: 8,
                          fontWeight: '700',
                        }}
                      >{item.category}</Text>
                    </View>
                    {
                      item.status === 'pending' ?
                        <View style={{
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          width: '100%',
                          marginTop: 25,
                        }}>
                          <Text style={{ fontSize: 22, }}>{item.title}</Text>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              alignItems: 'center',
                              margin: 10,
                            }}

                            onPress={() => {
                              handleCompleteTask(item._id);
                            }}>
                            <Text style={{ fontSize: 15, marginRight: 10 }}>Click To Complete</Text>
                            <Entypo
                              name="circle"
                              size={24}
                              color={colors.secondaryAccentColor} />
                          </TouchableOpacity>
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginTop: 10,
                          }}>
                            <Ionicons
                              name='trash'
                              size={30}
                              color={colors.secondaryAccentColor}
                              onPress={() => {
                                handleDeleteTask(item._id);
                              }}
                            />
                            <Ionicons
                              name='pencil-sharp'
                              size={30}
                              color={colors.secondaryAccentColor}
                              onPress={() => {
                                setBottomSheetVisible(true);
                                setIsEdit(true);
                                setAddTaskTitle(item.title);
                                setAddTaskName(item.category);
                                setEditingTaskId(item._id);
                              }}
                            />
                          </View>
                        </View>
                        :
                        null
                    }
                  </View>
                )}
              />
          }
        </View>
      </View>

      {/* Modal Sheet */}
      <Modal
        transparent={true}
        animationType='slide'
        visible={bottomSheetVisible}
        onRequestClose={closeBottomSheet}>
        <View style={styles.modalcontainer}>
          <View style={styles.modalsheet}>
            <TouchableOpacity onPress={closeBottomSheet}>
              <Ionicons name='close' size={40} color={'black'} />
            </TouchableOpacity>
            <View style={styles.form}>
              <View style={styles.textfield}>
                <TextInput
                  placeholder='Task Name'
                  value={addtaskTitle}
                  onChangeText={(text) => setAddTaskTitle(text)}
                />
              </View>
              <View style={styles.choosetask}>
                <Picker
                  selectedValue={addTaskName}
                  onValueChange={(itemValue, itemIndex) => {
                    setAddTaskName(itemValue)
                  }}
                  style={{ color: 'white', width: 200 }}
                >
                  <Picker.Item label="Sport" value="Sport" />
                  <Picker.Item label="Urgent" value="Urgent" />
                  <Picker.Item label="Common" value="Common" />
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.addtaskbtn}
                onPress={() => {
                  if (isEdit) {
                    handleEdit();
                    return;
                  }
                  handleAddTask();
                }}
              >
                <Text style={{ color: 'white', fontSize: 17 }}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default HomeTab

const styles = StyleSheet.create({
  task: {
    backgroundColor: colors.secondaryTertiaryColor,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 350,
    padding: 20,
    marginVertical: 15,
    borderRadius: 20,
    elevation: 4,
    shadowColor : colors.secondaryAccentColor,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.primaryBgColor,
  },
  modalsheet: {
    height: 300,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.primaryTertiaryColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalcontainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  addtaskbtn: {
    backgroundColor: colors.secondaryAccentColor,
    paddingVertical: 10,
    borderRadius: 10,
    width: 240,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textfield: {
    backgroundColor: 'white',
    width: 240,
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: colors.secondaryAccentColor,
    borderWidth: 2,
  },
  searchbar: {
    width: '80%',
    backgroundColor: colors.secondaryBgColor,
    position: 'absolute',
    top: 90,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.secondaryAccentColor,
    borderWidth: 1,
  },
  taskcontainer: {
    height: '70%',
    width: '100%',
    backgroundColor: colors.secondaryBgColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tasks: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  functions: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  opensheetbtn: {
    backgroundColor: colors.primaryTertiaryColor,
    marginRight: 10,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    borderColor: colors.primaryAccentColor,
    borderWidth: 1,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersbtn: {
    backgroundColor: colors.secondaryAccentColor,
    marginLeft: 10,
    borderColor: colors.primaryTertiaryColor,
    borderWidth: 1,
    borderRadius: 25,
  },
  choosetask: {
    backgroundColor: colors.secondaryAccentColor,
    width: 240,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: colors.primaryTertiaryColor,
    borderWidth: 1,
    color: 'white',
  },
  dueAt: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  category: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.secondaryAccentColor,
    borderRadius: 10,
  }
})