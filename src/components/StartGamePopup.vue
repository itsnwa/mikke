<template>
  <PopupDialog :show="show">
    <div class="text-header">
      <h1>Select Players</h1>
      <p>
        Select recent players to participate, or add new ones that will get
        saved to the list.
      </p>
    </div>

    <div class="list-header">
      <span
        class="label"
        v-text="addingNew ? 'Add New Player' : 'Recent Players'"
      />
      <span
        class="link"
        @click="addingNew ? deactivateAddNewForm() : activateAddNewForm()"
        v-text="addingNew ? 'Cancel' : '+ Add New'"
      />
    </div>

    <div class="add-new-form" v-if="addingNew">
      <input
        class="add-new-input"
        type="text"
        v-model="newPlayer"
        :placeholder="getRandomName"
        ref="addNewInput"
        @keyup.enter="addPlayer"
      />
    </div>

    <div class="recent-players" v-if="!addingNew">
      <div class="player" v-for="(player, index) in recentPlayers" :key="index">
        <div class="checkbox" @click="selectPlayer(player)">
          <div
            class="checkmark"
            v-if="
              selectedPlayers.find(
                selectedPlayer =>
                  selectedPlayer.name.toLowerCase() ===
                  player.name.toLowerCase()
              )
            "
          />
        </div>
        <div class="player--text">
          <span class="player--name">{{ player.name }}</span>
          <span class="player--times-played">
            Played {{ player.times_played }} times
          </span>
        </div>
      </div>
    </div>

    <div
      class="main-button"
      :disabled="!addingNew && selectedPlayers.length <= 0"
      @click="addingNew ? addPlayer() : startGame()"
      v-text="addingNew ? 'Add Player' : 'Start Game'"
    />
  </PopupDialog>
</template>

<script>
import { getRandomName } from "@/utils/knownPlayers.js"
import PopupDialog from "@/components/PopupDialog"

export default {
  components: {
    PopupDialog
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      players: [],
      selectedPlayers: [],
      addingNew: false,
      newPlayer: ""
    }
  },
  computed: {
    recentPlayers() {
      // Sort players by date
      if (this.players.length <= 1) {
        return [...this.players].sort((a, b) => {
          return b.last_played - a.last_played
        })
      } else {
        return this.players
      }
    },
    getRandomName
  },
  methods: {
    addPlayer() {
      let localStoragePlayers = JSON.parse(
        localStorage.getItem("recent_players") || "[]"
      )
      if (
        localStoragePlayers.find(
          player => player.name.toLowerCase() === this.newPlayer.toLowerCase()
        )
      ) {
        // Select the player if it already exists
        this.selectPlayer(
          localStoragePlayers.find(
            player => player.name.toLowerCase() === this.newPlayer.toLowerCase()
          )
        )
        this.newPlayer = ""
      } else {
        // Get players from local storage and add the new player to it
        const playerProfile = {
          name: this.newPlayer,
          times_played: 0,
          times_won: 0,
          last_played: new Date().getTime()
        }
        this.players = [playerProfile, ...localStoragePlayers]
        localStoragePlayers.push(playerProfile)
        localStorage.setItem(
          "recent_players",
          JSON.stringify(localStoragePlayers)
        )
        // Update the players array and clear the new player input
        this.selectPlayer(playerProfile)
        this.newPlayer = ""
        this.deactivateAddNewForm()
      }
    },
    startGame() {
      this.$emit("start-game", this.selectedPlayers)
    },
    selectPlayer(player) {
      // If the player is already selected → deselect.
      if (
        this.selectedPlayers.find(
          selectedPlayer =>
            selectedPlayer.name.toLowerCase() === player.name.toLowerCase()
        )
      ) {
        this.selectedPlayers = this.selectedPlayers.filter(
          selectedPlayer =>
            selectedPlayer.name.toLowerCase() !== player.name.toLowerCase()
        )
      } else {
        this.selectedPlayers = [
          ...this.selectedPlayers,
          {
            name: player.name,
            scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            points: 0,
            finished: false,
            hit: false,
            isPlaying: this.selectedPlayers.length <= 0 ? true : false
          }
        ]
      }
    },
    activateAddNewForm() {
      this.addingNew = true
      setTimeout(() => this.$refs.addNewInput.focus(), 500)
    },
    deactivateAddNewForm() {
      this.$refs.addNewInput.blur()
      this.addingNew = false
    }
  },
  mounted() {
    // Get recent players from localstorage
    this.players = JSON.parse(localStorage.getItem("recent_players") || "[]")
    if (this.players.length <= 0) {
      this.activateAddNewForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.text-header {
  text-align: center;
  padding: 40px 24px;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
  padding: 0 24px;
  user-select: none;
  .link {
    color: var(--brand-color);
    cursor: pointer;
    user-select: none;
  }
}
.add-new-input {
  border: 2px solid hsl(216, 51%, 75%);
  width: 100%;
  border-radius: 24px;
  height: 64px;
  transition: border 0.2s ease-in-out;
  &:focus {
    border: 2px solid var(--brand-color);
  }
}
.recent-players,
.add-new-form {
  padding: 0 24px 16px 24px;
  max-height: 360px;
  overflow-y: auto;
}
.player {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid hsl(196, 18%, 88%);
  padding: 0.6rem 0;
  &:last-of-type {
    border: 0;
  }
}
.player--text {
  display: flex;
  flex-direction: column;
}
.player--name {
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0;
}
.player--times-played {
  font-size: 0.8rem;
  margin-top: -0.25rem;
}
.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid hsl(216, 51%, 75%);
  margin-right: 16px;
}
.checkmark {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: hsl(196, 53%, 40%);
}
.main-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  margin: 0 16px 16px 16px;
  border-radius: 24px;
  background-color: var(--brand-color);
  color: white;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  &[disabled] {
    background-color: hsla(196, 53%, 40%, 0.5);
  }
}
</style>
