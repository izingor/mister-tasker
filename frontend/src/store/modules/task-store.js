import { taskService } from '../../services/task-service'

export default {
    state: {
        tasks: [],
    },
    getters: {
        tasks(state) {
            return state.tasks
        },
    },
    mutations: {
        setTasks(state, { tasks }) {
            state.tasks = tasks.sort((a, b) => b.createdAt - a.createdAt)
        },
        addTask(state, { task }) {
            state.tasks.unshift(task)
        },
        saveTask(state, { task }) {
            const idx = state.tasks.findIndex((o) => o._id === task._id);
            if (idx !== -1) state.tasks.splice(idx, 1, task);
            else state.tasks.unshift(task);
        },
        removeTask(state, { taskId }) {
            const idx = state.tasks.findIndex((task) => task._id === taskId)
            state.tasks.splice(idx, 1)
        },
    },
    actions: {
        async getTasks({ commit }) {
            try {
                const tasks = await taskService.query()
                commit({ type: 'setTasks', tasks })
                return tasks
            } catch (err) {
                console.log('err :>> ', err)
            }
        },
        async startTask({ commit }, { id }) {
            try {
                const addedTask = await taskService.startTask(id)
                // commit({ type: 'saveTask', task: addedTask })
                return addedTask;
            } catch (err) {
                console.log('err :>> ', err)
            }
        },
        async startAll({ commit }) {
            try {
                const addedTask = await taskService.startAll()
                // commit({ type: 'saveTask', task: addedTask })
                return addedTask;
            } catch (err) {
                console.log('err :>> ', err)
            }
        },
        async addTask({ commit }, { task }) {
            try {
                const addedTask = await taskService.save(task)
                commit({ type: 'saveTask', task: addedTask })
                return addedTask;
            } catch (err) {
                console.log('err :>> ', err)
            }
        },
        async removeTask({ commit }, { taskId }) {
            try {
                await taskService.removeTask(taskId)
                commit({ type: 'removeTask', taskId })
            } catch (err) {
                console.log('err :>> ', err)
            }
        },
    },
}
