import React, { useState } from 'react'
import './App.css'
import { v1 } from "uuid";
import { AddItemForm } from './AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import TodoList from './TodoList';
import { TaskPriorities, TaskStatuses, TaskType} from './api/todolistsAPI';
import { FilterValuesType, TodolistDomainType } from './store/todolists-reducer';

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

const App = () => {

    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
        { id: todolistID1, title: 'What to learn', filter: 'all', addedDate: '', order: 0 },
        { id: todolistID2, title: 'What to buy', filter: 'all', addedDate: '', order: 0  },
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
        [todolistID1]: [
            { id: v1(), title: "HTML&CSS",status: TaskStatuses.Completed, todoListId: todolistID1, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low },
            { id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: todolistID1, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low  },
            { id: v1(), title: "ReactJS", status: TaskStatuses.New, todoListId: todolistID1, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low  },
            { id: v1(), title: "Rest API", status: TaskStatuses.New, todoListId: todolistID1, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low  },
            { id: v1(), title: "GraphQL", status: TaskStatuses.New, todoListId: todolistID1, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low  },
        ],
        [todolistID2]: [
            { id: v1(), title: "HTML&CSS2",status: TaskStatuses.Completed, todoListId: todolistID2, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low  },
            { id: v1(), title: "JS2", status: TaskStatuses.Completed, todoListId: todolistID2, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low },
            { id: v1(), title: "ReactJS2",status: TaskStatuses.Completed, todoListId: todolistID2, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low },
            { id: v1(), title: "Rest API2",status: TaskStatuses.New, todoListId: todolistID2, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low },
            { id: v1(), title: "GraphQL2",status: TaskStatuses.New, todoListId: todolistID2, description: '', startDate:'', deadline: '', addedDate:'', order: 0, priority: TaskPriorities.Low },
        ]
    });

    const addTodoList = (title:string) => {
        const todoListID = v1()
        const newTodoList: TodolistDomainType = {
            id: todoListID,
            title: title,
            filter: "all",
            addedDate: '',
            order: 0
        }
        setTodolists([...todolists, newTodoList])
        setTasks({...tasks, [todoListID]: []})
    }

    const removeTask = (todolistsID: string, taskID: string) => {
        tasks[todolistsID] = tasks[todolistsID].filter(t => t.id !== taskID)
        setTasks({ ...tasks })
    }

    const addTask = (todolistsID: string, title: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: title,
            status: TaskStatuses.Completed,
            todoListId: todolistID2, description: '',
            startDate:'',
            deadline: '',
            addedDate:'',
            order: 0,
            priority: TaskPriorities.Low
        }
        tasks[todolistsID] = [newTask, ...tasks[todolistsID]]
        setTasks({ ...tasks })
    }

    const changeTaskStatus = (todolistsID: string, taskID: string, status: TaskStatuses) => {
        tasks[todolistsID] = tasks[todolistsID].map(t => t.id === taskID ? { ...t, status: status } : t)
        setTasks({ ...tasks })
    }

    const changeTaskTitle = (todolistsID: string, taskID: string, title: string) => {
        tasks[todolistsID] = tasks[todolistsID].map(t => t.id === taskID ? { ...t, title: title } : t)
        setTasks({ ...tasks })
    }


    //const [filter, setFilter] = useState<FilterValuesType>("all")

    const changeTodoListFilter = (todolistsID: string, nextFilter: FilterValuesType) => {
        let currentTodoList = todolists.find(t => t.id === todolistsID)
        if (currentTodoList) {
            currentTodoList.filter = nextFilter
            setTodolists(todolists.map(tl => tl.id === todolistsID ? { ...tl, filter: nextFilter } : tl))
        }
    }

    const changeTodoListTitle = ( todolistsID: string, title: string) => {
            setTodolists(todolists.map(tl => tl.id === todolistsID ? { ...tl, title: title } : tl))
        }
    

    const removeTodoList = (todolistsID: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistsID))
        const copyTask = { ...tasks }
        delete copyTask[todolistsID]
        setTasks(copyTask)
    }

    const getTasksForRender = (todoList: TodolistDomainType): TaskType[] => {
        switch (todoList.filter) {
            case "completed":
                return tasks[todoList.id].filter(t => t.status === TaskStatuses.Completed)
            case "active":
                return tasks[todoList.id].filter(t => t.status === TaskStatuses.New)
            default:
                return tasks[todoList.id]
        }
    }

    const todoListComponents = todolists.map(tl => {
        return (
            <Grid item key={tl.id} >
                <Paper style={{padding:"10px"}} elevation={5} >
                    <TodoList 
                id={tl.id}
                filter={tl.filter}
                title={tl.title}
                tasks={getTasksForRender(tl)}
                addTask={addTask}
                removeTask={removeTask}
                changeFilter={changeTodoListFilter}
                changeTaskStatus={changeTaskStatus}
                removeTodoList={removeTodoList} 
                addTodoList = {addTodoList}
                changeTodoListTitle= {changeTodoListTitle} 
                changeTaskTitle= {changeTaskTitle}
                 />
                </Paper>
                
            </Grid>
            
        )
    })


    return (
        <div className="App">
            <AppBar>
                <Toolbar style={{justifyContent: "space-between"}} >
                  <IconButton edge="start" color="inherit" aria-label="menu" >
                    <Menu/>
                </IconButton>
                <Typography variant="h6" >
                    News
                </Typography>
                <Button 
                variant="outlined"
                color="inherit">
                    Login
                </Button>  
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "80px 0"}} >
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5} >
{ todoListComponents }
                </Grid>
            </Container>
            
        </div>
       
    )
}

export default App;



{/* 
import React, {useState} from 'react'
import './App.css'
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";

export type FilterValuesType = "all" | "active" | "completed"

type todoListType = {
    id:string,
    title:string,
    filter:FilterValuesType
}

const App = () => {
    let[todolists,setTodolists]=useState<Array<todoListType>>([
        {id:v1(),title:'What to learn',filter:'all'},
        {id:v1(),title:'What to buy',filter:'all'},
    ])

    console.log(v1())
    // BLL:
    const [tasks, setTasks] = useState<Array<TaskType>>([
       {id: v1(), title: "HTML", isDone: false},
       {id: v1(), title: "CSS", isDone: true},
       {id: v1(), title: "JS", isDone: false},
       {id: v1(), title: "Beer", isDone: true},
       {id: v1(), title: "Milk", isDone: false},
    ])

    const removeTask = (taskID: string) => {
        const otherArr: Array<TaskType> = tasks.filter(t => t.id !== taskID)
        setTasks(otherArr)
        // setTasks(tasks.filter(t => t.id !== taskID))
    }

    const addTask = (title: string) => {
        // const newTask: TaskType = {
        //     id: v1(),
        //     title: title,
        //     isDone: false
        // }
        // const copyTasks = [...tasks]
        // copyTasks.push(newTask)
        // setTasks(copyTasks)
        setTasks([{ id: v1(), title, isDone: false}, ...tasks])

    }
    const changeTaskStatus = (taskID: string, isDone: boolean) => {
        // const updatedTasks = [...tasks]
        // const task = updatedTasks.find(t => t.id === taskID)
        // if(task){
        //     const index = updatedTasks.indexOf(task)
        //     const copyTask = {...task}
        //     copyTask.isDone = isDone
        //     updatedTasks[index] = copyTask
        // }

        // const updatedTasks = tasks.map(t => {
        //     if(t.id === taskID){
        //         let copyTask = {...t}
        //         copyTask.isDone = isDone
        //         return copyTask
        //     }
        //     return t
        // })
        // setTasks(updatedTasks)
        setTasks(tasks.map(t => t.id === taskID ? {...t, isDone} : t))
    }

    const [filter, setFilter] = useState<FilterValuesType>("all")
    const changeFilter = (nextFilter: FilterValuesType) => {
        setFilter(nextFilter)
    }

    const getTasksForRender = (): TaskType[] => {
        switch (filter) {
            case "completed":
                return tasks.filter(t => t.isDone)
            case "active":
                return tasks.filter(t => !t.isDone)
            default:
                return tasks
        }
    }
    // let tasksForRender = tasks
    // if(filter === "active"){
    //     tasksForRender = tasks.filter(t => !t.isDone)
    // }
    // if(filter === "completed"){
    //     tasksForRender = tasks.filter(t => t.isDone)
    // }


    // UI:
    return (
        <div className="App">
            <TodoList
                filter={filter}
                title={"What to learn"}
                tasks={getTasksForRender()}
                addTask={addTask}
                removeTask={removeTask}
                changeFilter={changeFilter}
                changeTaskStatus={changeTaskStatus}
            />
        </div>
    );
}

export default App;
*/}