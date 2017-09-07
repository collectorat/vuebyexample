let bus = new Vue()

let Task = {
    props: [
        'task'
    ],
    template: `
        <div class="task" :class="{ 'task--done': task.done }">
            {{ task.body }}
            <a href="#" @click.prevent="toggleDone(task.id)">Mark {{ task.done ? 'not done' : 'done' }}</a>
            <a href="#" @click.prevent="deleteTask(task.id)">Delete</a>
        </div>
    `,
    methods: {
        toggleDone (taskId) {
            bus.$emit('task:toggleDone', taskId)
        },
        deleteTask (taskId) {
            bus.$emit('task:deleted', taskId)
        }
    }
}

let TaskForm = {
    data () {
        return {
            form: {
                body: null
            }
        }
    },
    template: `
        <form action="#" @submit.prevent="addTask">
            <div class="input__group">
                <textarea cols="30" rows="6" v-model="form.body"></textarea>
            </div>
            <button type="submit">Add task</button>
        </form>
    `,
    methods: {
        addTask () {
            if (!this.form.body) {
                return
            }

            bus.$emit('task:added', {
                id: Date.now(),
                body: this.form.body,
                done: false
            })

            this.form.body = null
        }
    }
}

let Tasks = {
    components: {
        'task': Task,
        'task-form': TaskForm
    },
    data () {
        return {
            tasks: []
        }
    },
    template: `
        <div>
            <div class="tasks">
                <template v-if="tasks.length">
                    <task v-for="task in tasks" :task="task" :key="task.id"></task>
                </template>
                <span v-else>No tasks</span>
            </div>
            <task-form></task-form>
        </div>
    `,
    methods: {
        toggleDone (taskId) {
            let task = this.tasks.find((task) => {
                return task.id === taskId
            })

            task.done = !task.done
        },
        deleteTask (taskId) {
            this.tasks = this.tasks.filter((task) => {
                return task.id !== taskId
            })
        }
    },
    mounted () {
        bus.$on('task:added', (task) => {
            this.tasks.push(task)
        })

        bus.$on('task:toggleDone', (taskId) => {
            this.toggleDone(taskId)
        })

        bus.$on('task:deleted', (taskId) => {
            this.deleteTask(taskId)
        })
    }
}

let app = new Vue({
    el: '#app',
    components: {
        'tasks': Tasks
    }
})