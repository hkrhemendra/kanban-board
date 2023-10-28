import callApi from "./api";

const getAllColumns = async () => {
    const config = {
        method: "get",
        url: "/api/v1/column/",
    }

    const response = await callApi(config);
    return response;
}

const postColumns = async (title) => {
    const config = {
        method: "post",
        url: "/api/v1/column/",
        data: {
            title: title
        },
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
        },
    }
    const response = await callApi(config);
    return response;
}

const deleteColumnById = async (id) => {
    const config = {
        method: "delete",
        url: `/api/v1/column/${id}`,
    }

    const response = await callApi(config);
    return response;
}


const getAllTasks = async () => {
    const config = {
        method: "get",
        url: "/api/v1/task/",
    }

    const response = await callApi(config);
    return response;
}

const postTask = async (columnId, content) => {
    const config = {
        method: "post",
        url: `/api/v1/column/${columnId}/task/`,
        data: {
            content
        },
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
        },
    }
    const response = await callApi(config);
    return response;
}

const deleteTaskById = async (id) => {
    const config = {
        method: "delete",
        url: `/api/v1/task/${id}`,
    }

    const response = await callApi(config);
    return response;
}

const moveTaskToColumn = async (taskId, columnId) => {
    console.log('moving')
    const config = {
        method: 'patch',
        url: `/api/v1/task/${taskId}`,
        data: {
            newColumnId: columnId,
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded' }
    }
    const response = await callApi(config);
    return response;
}

export default getAllColumns;
export { postColumns, deleteColumnById, getAllTasks, postTask, deleteTaskById, moveTaskToColumn };