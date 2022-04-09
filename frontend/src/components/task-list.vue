<template>
  <section>
    <div class="task-list-container">
      <div class="task-list">
        <div v-for="task in tasks" :key="task._id">
          <task-preview v-if="task" :task="task" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import taskPreview from './task-preview.vue';

export default {
	name: 'task-list',
	props: {
		tasks: Array,
	},
	components: {
		taskPreview,
	},
	computed: {

	},
};
</script>
