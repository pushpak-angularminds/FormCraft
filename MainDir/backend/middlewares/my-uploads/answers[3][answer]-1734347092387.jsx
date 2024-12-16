import React, { useEffect } from 'react'
import { useState } from 'react'
import List from './List'
import { nanoid } from 'nanoid'

export default function () {

    const [arrData, setArrData] = useState(() => {
        return JSON.parse(localStorage.getItem('storage')) || []
    }
    )
    const [formData, setFormData] = useState({
        id: nanoid(),
        tName: '',
        editing: false
    });

    function handleChange(event) {
        let { name, type, checked, value } = event.target
        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    useEffect(() => {
        localStorage.setItem('storage', JSON.stringify(arrData));
    }, [arrData])

    useEffect(() => {
        setArrData(prev => {
            //   console.log('prev',prev);
            let x = prev?.map((data) => {
                console.log('data',{ ...data, editing: false })
                return { ...data, editing: false }
            })
              console.log('X',x);

            return x
        });
    }, [])

    function onSave() {
        setArrData(prev => [...prev, formData])
        setFormData({
            tName: '',
            id: null,
            editing: false
        });

    }
    console.log('arrData', arrData)

    function editTask(id) {
        setArrData((prev) => prev?.map((e) => id === e.id ? { ...e, editing: !e.editing } : e))
    }

    function onEditing(id){
        setArrData( prev => prev?.map(e => id === e.id ? ))
    }

    return (
        <div>

            <div className="container">
                <div className="row">

                    <div className="col-md-6 " id="root">
                        <div className="white-card">

                            <div className="">
                                <button className="btn btn btn-danger" type="button" id="deleteAll" name="">DeleteAll</button>
                            </div>

                            <div id="toDo" className="my-4">
                                <form action="">
                                    <div className="todo-box  input-group rounded-pill">
                                        <input onChange={handleChange} value={formData.tName} name="tName" type="text" placeholder="Task" className="form-control" id="todoInput" />
                                        <button className="btn " onClick={onSave} type="button" id="addBtn">Add Task</button>
                                        <button className="btn " onClick={onSave} type="button" id="saveBtn" name="">Save</button>
                                    </div>
                                </form>
                            </div>

                            <div id="showData">
                                <div className="ul-outer">
                                    <ul id="ulShow">
                                        {
                                            arrData?.map((data) => <List key={data.id} id={data.id} editTask={() => editTask(data.id)} handleChange={handleChange} dataVal={data.tName} editing={data.editing} />)
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 order-first d-flex justify-content-center align-items-center" id="title-container">
                        <div className="title-cls">
                            <h1>To-<span className="do">Do</span> List </h1>
                            <p>Angular Minds</p>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    )
}
