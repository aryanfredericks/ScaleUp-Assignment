
import React, { useState } from 'react'
import TaskContext from './TaskContext'

const TaskProvider = ({ children }) => {

    const [task , setTask] = useState({
        title :"",
        category : "",
    })

    return (
        <TaskContext.Provider value={{task , setTask}}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskProvider