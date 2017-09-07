let bus = new Vue()

let Task = {
    props: [
        'task'
    ],
    template: `
        <div class="task" :class="{ 'task--done': task.done }">
            {{ task.body }}
            <a v-if="!task.done" href="#" @click.prevent="markDone(task.id)">Mark done</a>
            <a v-else href="#" @click.prevent="markUndone(task.id)">Mark not done</a>
        </div>
    `,
    methods: {
        markDone (taskId) {
            bus.$emit('task:done', taskId)
        },
        markUndone (taskId) {
            bus.$emit('task:undone', taskId)
        },
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
        markDone (taskId) {
            let task = this.tasks.find((task) => {
                return task.id === taskId
            })

            if (!task) {
                return
            }

            task.done = true
        },
        markUndone (taskId) {
            let task = this.tasks.find((task) => {
                return task.id === taskId
            })

            if (!task) {
                return
            }

            task.done = false
        }
    },
    mounted () {
        bus.$on('task:added', (task) => {
            this.tasks.push(task)
        })

        bus.$on('task:done', (taskId) => {
            this.markDone(taskId)
        })

        bus.$on('task:undone', (taskId) => {
            this.markUndone(taskId)
        })
    }
}

let app = new Vue({
    el: '#app',
    components: {
        'tasks': Tasks
    }
})