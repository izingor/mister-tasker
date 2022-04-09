<template>
  <section>
    <div>
      <button @click="startAll">start all</button>
      <button @click="toggleCreate">create task</button>
    </div>
    <task-list :tasks="tasks" />
    <div v-if="isCreate">
      <label for="title">
        Title:
        <input v-model="task.title" id="title" type="text" />
      </label>
      <label for="description">
        Description:
        <input v-model="task.description" id="description" type="text" />
      </label>
      <label for="importance">
        Importance:
        <input
          v-model="task.importance"
          id="importance"
          type="number"
          min="1"
          max="5"
        />
      </label>
      <button @click="createTask">Save</button>
    </div>
  </section>
</template>

<script>
import taskList from '../components/task-list.vue';
import {socketService} from '../services/socket.service.js'

export default {
	name: 'task-app',
  	data() {
		return {
			isCreate:false,
			task:{
				title:'',
				description:'',
				importance:1,
			}
		};
	},
	created() {
		socketService.on('task', this.updateTask)
		this.$store.dispatch({ type: "getTasks" });
	},
	computed: {
		tasks() {
		return this.$store.getters.tasks;
		},
	},
	methods: {
		startAll(){
    		this.$store.dispatch({ type: "startAll" });
		},
		updateTask(task){
			console.log('socket!!!!!!!!',task);
			this.$store.commit({ type: "saveTask", task:task });
		},
		toggleCreate(){
			this.isCreate=!this.isCreate; 
		},
		async createTask(){
			await this.$store.dispatch({ type: "addTask", task:this.task });
			this.isCreate= false;
		}
		
	},
	components: {
		taskList,
	},
};
</script>