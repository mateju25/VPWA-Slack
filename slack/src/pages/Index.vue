<template>
  <q-page class='q-pa-md container'>
    <q-infinite-scroll id='chat' @load='onLoad' class='full-width overflow-auto' reverse>
      <template v-slot:loading>
        <div class='row justify-center q-my-md'>
          <q-spinner color='primary' name='dots' size='20px' />
        </div>
      </template>

      <div v-for='message in alreadyTyped' v-bind:key='message.id'>
        <q-chat-message
          v-if='message.writtenBy.nickname === loggedUser.nickname'
          :name='message.writtenBy.nickname'
          :text='[prepareMessage(message.text)]'
          :text-html='true'
          sent
          :stamp="date.formatDate(message.created, 'HH:mm DD.MM.YYYY')"
        >
          <template v-slot:avatar>
            <Avatar class='q-mx-md' :contact='message.writtenBy' :in-header='false' showBadge='false'/>
          </template>
        </q-chat-message>
        <q-chat-message
          v-else
          :name='message.writtenBy.nickname'
          :text='[prepareMessage(message.text)]'
          :text-html='true'
          received
          :stamp="date.formatDate(message.created, 'HH:mm DD.MM.YYYY')"
        >
          <template v-slot:avatar>
            <Avatar class='q-mx-md' :contact='message.writtenBy' :in-header='false' showBadge='false'/>
          </template>
        </q-chat-message>

      </div>
    </q-infinite-scroll>
    <div v-if='currentlyTyping.length !== 0' class='typing q-mt-md'
         :class="Dark.isActive ? 'input-bottom-dark' : 'input-bottom-white'">
      <div :class="Dark.isActive ? 'yellow-text' : 'black-text'" class='typing-font q-ml-sm typing-hover'
           v-for='(message, index) in currentlyTyping' v-bind:key='message.id'>
        <p>{{ message.writtenBy.nickname }} <span v-if='index !== currentlyTyping.length - 1'>,</span></p>

        <div class='text' :class="Dark.isActive ? 'input-bottom-dark' : 'input-bottom-white'">
          <p class='q-ma-lg' :class="Dark.isActive ? '' : 'black-text'">{{ message.text }}</p>
        </div>

      </div>
      <p class='typing-font q-ml-sm' :class="Dark.isActive ? 'yellow-text' : 'black-text'">is typing...</p>
    </div>
    <q-form
      @submit='submit'
      class='my-form'
    >
      <q-input
        class='chat-input'
        square filled
        type='textarea'
        autogrow
        v-model='myMessage'
        placeholder='Message'
      />

      <div :class="Dark.isActive ? 'input-bottom-dark' : 'input-bottom-white'">
        <div class='row justify-between'>
          <q-btn color='secondary' class='menu-actions' icon='code' flat>
            <q-menu
              transition-show="scale"
              transition-hide="scale"
            >
              <q-list class='menu-actions'>
                <q-btn
                  v-for="btn in actions"
                  :key="btn"
                  flat
                  :color="Dark.isActive ? 'white' : 'black'"
                  :label="btn"
                  @click="addCommandToInput(btn)"
                />
              </q-list>
            </q-menu>
          </q-btn>
          <div class='row'>
            <q-btn
              class='menu-btns'
              v-for='btn in actions'
              :key='btn'
              flat
              :color="Dark.isActive ? 'white' : 'black'"
              :label='btn'
              @click='addCommandToInput(btn)'
            />
          </div>
          <q-btn
            :disable='myMessage.length === 0'
            icon='send'
            type='submit'
            color='secondary'
            size='md'
            flat
            class='float-right q-pa-xs q-px-md'
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import { Dark, date } from 'quasar';
import { Message, User } from 'components/models';
import Avatar from 'components/Avatar.vue';


export default defineComponent({
  name: 'PageIndex',
  components: { Avatar},
  props: {
    messages: {
      type: Array as PropType<Array<Message>>,
      required: true
    }
  },
  data() {
    return {
      loggedUser: this.$store.state.chatModule.loggedUser,
      Dark: Dark,
      date: date,
      myMessage: '',
      actions: ['@', '/join', '/invite', '/revoke', '/kick', '/quit', '/cancel']
    };
  },
  computed: {
    alreadyTyped: function(): Message[] {
      return this.messages.filter(item => !item.currentlyBeingTyped);
    },
    currentlyTyping: function(): Message[] {
      return this.messages.filter(item => item.currentlyBeingTyped);
    }
  },
  methods: {
    prepareMessage(message: string): string {
      return  message.replace('@'+(this.loggedUser as User).nickname , '<strong class="mention underlined-text">'+(this.loggedUser as User).nickname+'</strong>');
    },
    submit() {
      this.$emit('newMessage', this.myMessage);
      this.myMessage = '';
      setTimeout(() => {
        let objDiv = document.getElementById('chat') as HTMLElement;
        objDiv.scrollTop = objDiv.scrollHeight;
      },20)
    },
    onLoad(index: number, done: () => void) {
      // setTimeout(() => {
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      //   done()
      // }, 2000)
      done();
    },
    addCommandToInput(action: string): void {
      this.myMessage = this.myMessage.concat(' ', action);
    }
  }

})
;
</script>

<style>
.menu-actions {
  display: block;
}

.menu-btns {
  display: none;
}

.menu-actions .q-btn__content {
  margin-top: 2px;
}

@media (min-width: 1200px) {
  .menu-actions {
    display: none;
  }

  .menu-btns {
    display: block;
  }
}

#chat {
  height: 86%;
}

.container {
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.my-form {
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
}

.text {
  max-width: 40%;
  font-size: 16px;
  position: absolute;
  bottom: 135px;
  color: white;
  background: var(--q-dark);
  box-shadow: 0 0px 8px var(--q-secondary), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%) !important;
}

.input-bottom-dark {
  background-color: var(--q-dark);
}

.input-bottom-white {
  background-color: #d9d9d9;
}

.typing {
  height: 20px;
  display: flex;
}

.typing-font {
  font-size: 12px;
}

.yellow-text {
  color: #f3ce7a;
}

.black-text {
  color: black;
}

.typing-hover .text {
  visibility: hidden;
  opacity: 0;
  transition: .3s;
}

.typing-hover:hover .text {
  visibility: visible;
  opacity: 1;
  transition: .3s;
}
.chat-input {
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
}
.mention {
  background: var(--q-secondary);
  border-radius: 5px;
  padding: 2px;
}
</style>
