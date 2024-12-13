import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Note from './PracticeComponents/Note'
import Bin from './PracticeComponents/Bin'

const DragDropProcice = () => {
    const [notes, setNotes] = useState(['Note 1', 'Note 2', 'Note 3'])
    const [binnedNotes, setBinnedNotes] = useState([])
    return (
        <DndProvider backend={HTML5Backend}>

            <div>DragDropProcice</div>
            {notes.map((note, idx) => (
                <Note key={idx} note={note} setBinnedNotes={setBinnedNotes} />
            ))
            }
            <Bin binnedNotes={binnedNotes}/> 
        </DndProvider>
    )
}

export default DragDropProcice