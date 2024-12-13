import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'

const Note = ({ note, setBinnedNotes }) => {
    const [{ isDragging }, darg] = useDrag(() => ({
        type: 'note',
        item: { name: note },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            console.log('item', item)
            console.log('dropResult', dropResult)
            if (item && dropResult) {
                console.log(`you throw note ${item} into ${dropResult}`)
                console.log(`you throw note ${item.name} into ${dropResult.name}`)

                setBinnedNotes(prev => [...prev, item.name])
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    })
        , [])
    return (
        <div ref={darg}>{note}</div>
    )
}

export default Note