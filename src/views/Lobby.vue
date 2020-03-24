<template>
  <div>
    <div class="options" v-if="!newRoomFormActive && !existingRoomFormActive">
      <div class="option" @click="openNewRoomForm">
        <h3>Create new room</h3>
        <span>
          Set up a new room and let your friends and familiy join you
        </span>
      </div>
      <div class="option" @click="openExistingRoomForm">
        <h3>Join existing room</h3>
        <span>
          Already have a room set up or got an invite from a dart buddy?
        </span>
      </div>
    </div>
    <div class="form" v-if="newRoomFormActive">
      <h1>Create new room</h1>
      <label>Room name</label>
      <input type="text" v-model="newRoomName" placeholder="Room name" />
      <label>Password <span>(optional)</span></label>
      <input type="text" v-model="newRoomPassword" placeholder="Password" />
      <button @click.prevent="createRoom">Create room</button>
      <button class="cancel" @click.prevent="cancel">Cancel</button>
    </div>
    <div class="form" v-if="existingRoomFormActive">
      <h1>Join room</h1>
      <label>Room name</label>
      <input type="text" v-model="existingRoomName" placeholder="Room name" />
      <div class="password-form" v-if="passwordPromptActive">
        <label style="color:red;">Password required</label>
        <input
          type="text"
          v-model="existingRoomPassword"
          placeholder="Password"
        />
      </div>
      <button
        @click.prevent="passwordPromptActive ? joinWithPassword() : joinRoom()"
      >
        Join room
      </button>
      <button class="cancel" @click.prevent="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import firebase, { db } from "@/db"
export default {
  data() {
    return {
      newRoomName: "",
      newRoomPassword: "",
      existingRoomName: "",
      existingRoomPassword: "",
      roomRefSnapshot: null,
      passwordPromptActive: false,
      newRoomFormActive: false,
      existingRoomFormActive: false
    }
  },
  methods: {
    cancel() {
      this.newRoomName = ""
      this.newRoomPassword = ""
      this.existingRoomName = ""
      this.existingRoomPassword = ""
      this.roomRefSnapshot = null
      this.newRoomFormActive = false
      this.existingRoomFormActive = false
      this.passwordPromptActive = false
    },
    openNewRoomForm() {
      this.existingRoomFormActive = false
      this.newRoomFormActive = true
    },
    openExistingRoomForm() {
      this.newRoomFormActive = false
      this.existingRoomFormActive = true
    },
    async createRoom() {
      const roomRef = await db.collection("rooms").doc(this.newRoomName)

      // Make sure room name is not already taken
      this.roomRefSnapshot = await roomRef.get()
      if (this.roomRefSnapshot.exists) {
        return
      }

      // Room name is not taken, navigate to new game room
      this.$router.push(`/${this.newRoomName}`)

      // Set game room in db
      roomRef.set({
        name: this.newRoomName,
        password: this.newRoomPassword ? this.newRoomPassword : "",
        players: []
      })
    },
    async joinRoom() {
      const roomRef = await db.collection("rooms").doc(this.existingRoomName)
      this.roomRefSnapshot = await roomRef.get()
      // Check if room exists
      if (!this.roomRefSnapshot.exists) {
        return
      }
      if (this.roomRefSnapshot.data().password) {
        this.passwordPromptActive = true
      } else {
        this.$router.push(`/${this.existingRoomName}`)
      }
    },
    joinWithPassword() {
      if (this.existingRoomPassword != this.roomRefSnapshot.data().password) {
        this.cancel()
        return
      } else {
        this.$router.push(`/${this.existingRoomName}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.options {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  align-content: center;
  height: 100vh;
  max-width: 920px;
  margin: 0 auto;
  padding: 2rem;
  user-select: none;
  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
}
.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #333;
  border-radius: 6px;
  min-height: 200px;
  padding: 1rem;
  cursor: pointer;
  h3 {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }
  span {
    color: #666;
    font-weight: 300;
  }
  &:hover {
    background-color: #141414;
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 720px;
  min-height: 100vh;
  margin: 2rem auto;
  h1 {
    margin: 0 0 4rem 0;
  }
  label {
    display: block;
    margin: 0 0 1rem 0;
    span {
      opacity: 0.4;
    }
  }
  input {
    display: block;
    width: 100%;
    margin: 0 0 2rem 0;
    font-size: 1rem;
    padding: 0.8rem 1rem;
    -moz-appearance: none;
    border-radius: 6px;
    border: 0;
    background-color: #333;
    color: white;
  }
  button {
    padding: 1rem;
    font-size: 0.8rem;
    border-radius: 6px;
    border: 0;
    margin-top: 2rem;
    background: white;
  }
  button.cancel {
    background: transparent;
    border: 0;
    color: white;
    padding: 1rem;
    font-size: 0.8rem;
    margin: 0;
  }
}
</style>
