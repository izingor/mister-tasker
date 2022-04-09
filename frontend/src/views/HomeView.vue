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
import { socketService } from '../services/socket.service.js';

export default {
	name: 'task-app',
	data() {
		return {
			isWorkerOn: false,
		};
	},
	created() {
		this.$store.dispatch({ type: 'getTasks' });
	},
	computed: {
		tasks() {
			return this.$store.getters.tasks;
		},
	},
	methods: {
		startAll() {
			this.isWorkerOn = !this.isWorkerOn;
			socketService.emit('worker status', this.isWorkerOn);
			this.$store.dispatch({ type: 'startAll', isWorkerOn: this.isWorkerOn });
		},
	},
	components: {
		taskList,
	},
};
</script>
