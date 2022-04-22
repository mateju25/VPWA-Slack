<template>
  <div>
    <q-avatar
      :color="inHeader ? 'blue-grey-11' : 'primary'"
      square
      class='border-avatar'
      :style='backgroundColor'
      :text-color="inHeader ? 'primary' : 'white'"
      :size="size"
    >
      {{ contact.username[0] }}
      <q-badge
        v-if='noBadge === false'
        class="absolute-bottom-right badge-state"
        :class="userState(contact.preference.stateName)"
      />
    </q-avatar>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import { User } from 'src/components/models';

export default defineComponent({
  props: {
    contact: Object as PropType<User>,
    inHeader: Boolean,
    size: String,
    noBadge: Boolean
  },
  computed: {
    backgroundColor() {
      if (this.inHeader)
        return '';
      let hash = this.hashCode(this.contact!.username);
      let r = Math.min( ((hash & 0xFF0000) >> 16) , 255);
      let b = Math.min(((hash & 0x00FF00) >> 8), 255);
      let g = Math.min((hash & 0x0000FF), 255);
      return `background-color: rgb(${Math.min(r + 20, 255)},${g + 20},${b + 20}) !important;`;
    }
  },
  methods: {
    hashCode(name: string): number {
      return name.split('').reduce((a: number, b: string) => {
        a = ((a << 5)-a)+b.charCodeAt(0);
        return a&a
      }, 0);
    },
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
.border-avatar {
  border: 1px solid #00021817;
  border-radius: 25px;
}
</style>
