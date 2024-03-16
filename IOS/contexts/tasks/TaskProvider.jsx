
import React, { useState } from 'react'
import TaskContext from './TaskContext'

const TaskProvider = ({ children }) => {

    const [task , setTask] = useState({
        title :"",
        category : "",
    })

    const [myTrigger , setMyTrigger] = useState(false);

    return (
        <TaskContext.Provider value={{task , setTask,myTrigger , setMyTrigger}}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskProvider