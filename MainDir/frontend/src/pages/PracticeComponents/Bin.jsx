import React from 'react'
import { useDrop } from 'react-dnd';

const Bin = ({ binnedNotes }) => {

    const [{ canDrop, isOver }, drop] = useDrop({
        // accept receives a definition of what must be the type of the dragged item to be droppable
        accept: 'note',
        drop: () =>({name:'the bin'}),
        collect:(monitor) =>({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        })
    },[]);
    return (
        <div className='h-screen w-screen' ref={drop}>
            <div className='h-1/2 w-1/2 border-2 h- rounded-md'>
                <div className='text-center'>Bin</div>
                <div>{binnedNotes?.map((item, i) => (
                    <p key={i}>{item}</p>
                ))}</div>
            </div>
        </div>
    )
}

export default Bin