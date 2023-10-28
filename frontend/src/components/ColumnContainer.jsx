import React, { useMemo } from "react";
import TrashIcon from "../icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";


const ColumnContainer = ({ column, deleteColumn, createTask, task, deleteTask }) => {

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const taskIds = useMemo(()=>{
        return task.map(item => item.id)
    }, [task])

    if(isDragging){
        return <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-500">

        </div>
    }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div  className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div className="flex gap-2 justify-between w-full">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {column.title}
          <button
            onClick={() => {
              deleteColumn(column.id);
            }}
            className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
        {
            task.map(ele => {
                return <TaskCard key={ele.id} task={ele} deleteTask={deleteTask}/>
            })
        }
        </SortableContext>
        
      </div>
      <div>
        <button onClick={() => {createTask(column.id)}} className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black w-full" >
            <PlusIcon/>
            Add task
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;
