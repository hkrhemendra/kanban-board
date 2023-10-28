import React, { useEffect, useMemo, useState, useRef } from "react";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import getAllColumns, {
  deleteColumnById,
  deleteTaskById,
  getAllTasks,
  moveTaskToColumn,
  postColumns,
  postTask,
} from "../api/callApi";

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);

  const [activeColumn, setActiveColumn] = useState(null);

  const [task, setTasks] = useState([]);

  const [activeTask, setActiveTask] = useState(null);

  const columnsId = useMemo(() => columns.map((ele) => ele.id), [columns]);

  const initialized = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 300 px
      },
    })
  );

  // const generateId = () => {
  //   return Math.floor(Math.random() * 10001);
  // };

  const setAllColumns = async () => {
    const response = await getAllColumns();
    if (response.status) {
      setColumns(response.data.data);
    }
  };

  const setAllTasks = async () => {
    const response = await getAllTasks();
    if (response.status) {
      setTasks(response.data.data);
    }
  };

  const createNewColumn = async () => {
    const title = `List ${columns.length + 1}`;
    const response = await postColumns(title);
    if (response.status) {
      setColumns([...columns, response.data.data]);
    }
  };

  const deleteColumn = async (id) => {
    console.log("delete called " + id);
    const response = await deleteColumnById(id);
    if (response.status) {
      setAllColumns();
    }
  };

  const onDragStart = (event) => {
    console.log("Drag start", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.column);
      return;
    }
  };

  const onDragEnd = (event) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const createTask = async (columnId) => {
    // const newTask = {
    //     id: generateId(),
    //     content: `Task ${task.length + 1}`,
    //     columnId,
    // }
    const content = `Task ${task.length + 1}`;
    const response = await postTask(columnId, content);
    if (response.status) {
      setAllTasks();
    }
  };

  const deleteTask = async (id) => {
    const response = await deleteTaskById(id);
    if (response.status) {
      setAllTasks();
    }
  };

  const onDragOver = async (event) => {
    console.log(event);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    console.log("Active ---> ", active);

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((task) => {
        const activeIndex = task.findIndex((ele) => ele.id === active.id);

        const overIndex = task.findIndex((ele) => ele.id === over.id);

        task[activeIndex].columnId = task[overIndex].columnId;

        return arrayMove(task, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    let newColumnId;

    // dropping a task over a column
    if (isActiveTask && isOverAColumn) {
      console.log("Yo active id ----> ", active.id);
      console.log("Yo current column Id ----> ", overColumnId);

      setTasks(async (task) => {
        const activeIndex = task.findIndex((ele) => ele.id === active.id);
        task[activeIndex].columnId = overColumnId;
        setAllTasks()
        await moveTaskToColumn(active.id, over.id);
        return arrayMove(task, activeIndex, activeIndex);
      });
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      console.log("executing");
      setAllColumns();
      setAllTasks();
    }
  }, [columns]);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="m-aut flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((ele) => (
                <ColumnContainer
                  key={ele.id}
                  column={ele}
                  deleteColumn={deleteColumn}
                  createTask={createTask}
                  task={task.filter((item) => item.columnId === ele.id)}
                  deleteTask={deleteTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                key={activeColumn.id}
                column={activeColumn}
                deleteColumn={deleteColumn}
                createTask={createTask}
                task={task.filter((item) => item.columnId === activeColumn.id)}
                deleteTask={deleteTask}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} deleteTask={deleteTask} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
