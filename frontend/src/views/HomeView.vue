<template>
  <section>
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

	},
	components: {
		taskList,
	},
};
</script>