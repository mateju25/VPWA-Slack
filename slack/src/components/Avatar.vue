<template>
  <div>
    <q-avatar
      :color="inHeader ? 'blue-grey-11' : 'primary'"
      square
      :text-color="inHeader ? 'primary' : 'white'"
      :size="size"
    >
      {{ contact.nickname[0] }}
      <q-badge
        v-if='showBadge === false'
        class="absolute-bottom-right badge-state"
        :class="userState(contact.state)"
      />
    </q-avatar>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import { User } from './models';

export default defineComponent({
  props: {
    contact: Object as PropType<User>,
    inHeader: Boolean,
    size: String,
    showBadge: Boolean
  },
  methods: {
    userState(state: string): string {
      let color = 'bg-negative';
      switch (state) {
        case 'Online':
          color = 'bg-positive';
          break;
        case 'Offline':
          color = 'bg-negative';
          break;
        case 'DND':
          color = 'bg-warning';
          break;
      }
      ;
      return color;
    }
  }

});

</script>

<style>
.badge-state {
  margin: 0 -4px -4px 0;
  padding: 0;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 10px;
}
</style>
