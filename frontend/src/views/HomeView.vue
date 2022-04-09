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

export default {
	name: 'task-app',
  data() {
		return {
			
		};
	},
	created() {
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
		}
	},
	components: {
		taskList,
	},
};
</script>