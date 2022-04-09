<template>
  <section>
    <div>
      <button @click="startAll">start all</button>
    </div>
    <task-list :tasks="tasks" />
  </section>
</template>

<script>
import taskList from '../components/task-list.vue';
import {socketService} from '../services/socket.service.js'

export default {
	name: 'task-app',
  	data() {
		return {
			
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
		
	},
	components: {
		taskList,
	},
};
</script>