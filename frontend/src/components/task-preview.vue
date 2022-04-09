<template>
  <section class="task-prev">
    <p class="title">{{ task.title }}</p>
    <p class="importance">{{ task.importance }}</p>
    <p class="triesCount">{{ task.triesCount }}</p>
    <p class="status">{{ task.status }}</p>
    <div>
      <button @click="startTask">start</button>
    </div>
  </section>
</template>

<script>
export default {
	name: 'task-preview',
	props: {
		task: Object,
	},
	computed: {

	},
	methods: {
		startTask(){
			this.$store.dispatch({ type: "startTask", id: this.task._id });	
		}
	},
};
</script>

<style>
.task-prev {
  display: flex;
  justify-content: space-between;
}
.title {
  width: 200px;
}
.triesCount {
  width: 20px;
}
</style>
