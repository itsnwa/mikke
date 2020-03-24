<template>
  <div class="game-view">
    <div class="number-picker" v-if="selectingNumber">
      <div
        class="number"
        v-for="(number, index) in pointValues"
        :key="index"
        @click="setPoints(number)"
      >
        <span v-if="number === 50">Bull (50)</span>
        <span v-else>{{ number }}</span>
      </div>
    </div>
    <div class="menu-toggle" @click="toggleMenu">
      <img src="@/assets/dartboard.svg" />
    </div>
    <div class="menu" v-if="menuOpen">
      <div class="close-menu" @click="toggleMenu">
        <img src="@/assets/times.svg" />
      </div>
      <div class="menu-content">
        <span @click="undo">Undo</span>
        <span @click="activateAddNewPlayer">Add player</span>
        <span @click="restartGame">Restart game</span>
        <span @click="leaveGame">Leave game</span>
      </div>
    </div>
    <div class="scores">
      <div class="score" v-for="(score, index) in scores" :key="index">
        {{ score }}
      </div>
    </div>
    <div class="players">
      <draggable
        v-model="room.players"
        v-bind="dragOptions"
        @start="drag = true"
        @end="endPlayerDrag"
        handle=".name"
      >
        <transition-group
          class="flex"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <div
            class="player"
            v-for="(player, playerIndex) in players"
            :key="player.name"
          >
            <div class="name">
              {{ player.name }}
              <div class="points">
                {{ player.points }}
              </div>
              <div class="remove-player" @click="removePlayer(playerIndex)">
                <img src="@/assets/times.svg" />
              </div>
            </div>
            <div class="player-scores">
              <div class="winning" v-if="player.finished">
                <img src="@/assets/winning.gif" />
              </div>
              <div
                class="player-score"
                v-for="(score, scoreIndex) in player.scores"
                :key="scoreIndex"
                @click="increaseScore(playerIndex, score, scoreIndex)"
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26 48.5333C38.4448 48.5333 48.5333 38.4448 48.5333 26C48.5333 13.5552 38.4448 3.46667 26 3.46667C13.5552 3.46667 3.46667 13.5552 3.46667 26C3.46667 38.4448 13.5552 48.5333 26 48.5333ZM26 52C40.3594 52 52 40.3594 52 26C52 11.6406 40.3594 0 26 0C11.6406 0 0 11.6406 0 26C0 40.3594 11.6406 52 26 52Z"
                    :fill="score >= 3 ? `white` : `transparent`"
                  />
                  <rect
                    width="4.08418"
                    height="40.8418"
                    rx="1"
                    transform="matrix(0.708377 -0.705834 0.708377 0.705834 10 13.1725)"
                    :fill="score >= 2 ? `white` : `transparent`"
                  />
                  <rect
                    width="4.08418"
                    height="40.8418"
                    rx="1"
                    transform="matrix(-0.708377 -0.705834 0.708377 -0.705834 13.0686 41.7103)"
                    :fill="score >= 1 ? `white` : `transparent`"
                  />
                </svg>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="bottom-controller" v-if="addNewPlayerPanelActive">
      <input
        type="text"
        v-model="newPlayer"
        @keyup.enter="addPlayer"
        placeholder="name"
      />
      <button
        class="button"
        :disabled="newPlayer.length < 2"
        @click="addPlayer"
      >
        Add new player
      </button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable"
import firebase, { db } from "@/db"

export default {
  name: "app",
  components: {
    draggable
  },
  data() {
    return {
      room: {},
      scores: ["20", "19", "18", "17", "16", "15", "14", "T", "D", "B"],
      scoreValues: [...Array(21).keys()].slice(1).reverse(),
      selectingNumber: false,
      selectedNumber: null,
      isTriple: false,
      isDouble: false,
      notDonePlayers: null,
      addNewPlayerPanelActive: false,
      newPlayer: "",
      drag: false,
      menuOpen: false
    }
  },
  computed: {
    pointValues() {
      if (this.isDouble) {
        return [...this.scoreValues, 50]
      } else {
        return this.scoreValues
      }
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: "ghost"
      }
    },
    players() {
      return this.room.players
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.$bind(
          "room",
          db.collection("rooms").doc(this.$route.params.roomID)
        )
      }
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    leaveGame() {
      this.menuOpen = false
      this.$router.push("/")
    },
    undo() {
      this.menuOpen = false
    },
    restartGame() {
      this.menuOpen = false
      this.isTriple = false
      this.isDouble = false
      this.notDonePlayers = null
      this.players.forEach(player => {
        player.scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.points = 0
        player.finished = false
      })
      this.$firestoreRefs.room.update({
        players: this.players
      })
    },
    resetGame() {
      this.players = []
      this.selectingNumber = false
      this.selectedNumber = null
      this.isTriple = false
      this.isDouble = false
      this.notDonePlayers = null
      this.$firestoreRefs.room.update({
        players: []
      })
    },
    activateAddNewPlayer() {
      this.menuOpen = false
      this.newPlayer = ""
      this.addNewPlayerPanelActive = true
    },
    addPlayer() {
      if (this.newPlayer.length >= 2) {
        const player = {
          name: this.newPlayer,
          scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          points: 0,
          finished: false
        }

        this.newPlayer = ""
        this.addNewPlayerPanelActive = false
        this.players.push(player)

        this.$firestoreRefs.room.update({
          players: this.players
        })
      }
    },
    removePlayer(playerIndex) {
      this.players.splice(playerIndex, 1)
      this.$firestoreRefs.room.update({
        players: this.players
      })
    },
    setPoints(number) {
      this.isTriple ? this.scoreTriple(number) : this.scoreDouble(number)
    },
    scoreTriple(number) {
      let points = number * 3
      this.notDonePlayers.forEach(player => {
        player.points += points
      })

      this.players.forEach(player => {
        if (player.scores.every(score => score === 3)) {
          // Check if player has the least amount of points
          let pointsList = this.players.map(player => player.points)
          let lowScore = Math.min.apply(Math, pointsList)
          let scoreIndex = pointsList.indexOf(lowScore)
          let bestPlayer = this.players[scoreIndex]

          if (bestPlayer.name === player.name) {
            player.finished = true
          }
        } else {
          player.finished = false
        }
      })

      this.$firestoreRefs.room.update({
        players: this.players
      })

      this.selectingNumber = false
      this.selectedNumber = null
      this.isTriple = false
    },
    scoreDouble(number) {
      let points = number === 50 ? number : number * 2
      this.players.forEach(player => {
        if (player.scores.every(score => score === 3)) {
          // Check if player has the least amount of points
          let pointsList = this.players.map(player => player.points)
          let lowScore = Math.min.apply(Math, pointsList)
          let scoreIndex = pointsList.indexOf(lowScore)
          let bestPlayer = this.players[scoreIndex]

          if (bestPlayer.name === player.name) {
            player.finished = true
          }
        } else {
          player.finished = false
        }
      })
      this.notDonePlayers.forEach(player => {
        player.points += points
      })
      this.$firestoreRefs.room.update({
        players: this.players
      })
      this.selectingNumber = false
      this.selectedNumber = null
      this.isDouble = false
    },
    increaseScore(playerIndex, score, index) {
      if (this.players[playerIndex].scores[index] === 3) {
        // Check if other players are done, if not - give them points
        this.notDonePlayers = this.players.filter(
          player => player.scores[index] < 3
        )

        // Check if it's a number (20-14)
        if (index <= 6) {
          this.notDonePlayers.forEach(player => {
            player.points += this.scoreValues[index]
          })
        } else if (index === 7) {
          // Triples
          this.selectingNumber = true
          this.isTriple = true
        } else if (index === 8) {
          // Doubles
          this.selectingNumber = true
          this.isDouble = true
        } else {
          // Bull
          this.notDonePlayers.forEach(player => {
            player.points += 25
          })
        }
      } else {
        this.players[playerIndex].scores[index] =
          this.players[playerIndex].scores[index] + 1
      }
      if (this.players[playerIndex].scores.every(score => score === 3)) {
        // Check if player has the least amount of points
        let pointsList = this.players.map(player => player.points)
        let lowScore = Math.min.apply(Math, pointsList)
        let scoreIndex = pointsList.indexOf(lowScore)
        let bestPlayer = this.players[scoreIndex]

        if (bestPlayer.name === this.players[playerIndex].name) {
          this.players[playerIndex].finished = true
        }
      } else {
        this.players[playerIndex].finished = false
      }
      this.$firestoreRefs.room.update({
        players: this.players
      })
    },
    endPlayerDrag() {
      this.drag = false
      this.$firestoreRefs.room.update({
        players: this.players
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.game-view {
  width: 100vw;
  overflow: hidden;
}
.menu-toggle {
  position: absolute;
  left: 0;
  top: 0;
  width: 4rem;
  height: 6rem;
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.disabled {
    color: #333;
    pointer-events: none;
  }
}
.menu {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: black;
  z-index: 10;
  .menu-content {
    font-size: 2.5rem;
    line-height: 2;
    padding: 4rem;
    span {
      display: block;
    }
  }
  .close-menu {
    position: absolute;
    left: 0;
    top: 0;
    width: 4rem;
    height: 6rem;
    border-bottom: 1px solid #333;
    border-right: 1px solid #333;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.disabled {
      color: #333;
      pointer-events: none;
    }
  }
}
.scores {
  position: absolute;
  left: 0;
  top: 6rem;
  width: 4rem;
  height: calc(100vh - 6rem);
  display: flex;
  flex-direction: column;
  user-select: none;
  padding: 0 0 env(safe-area-inset-bottom) 0;
}
.score {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
  line-height: 0;
  font-size: 1.2rem;
  font-weight: bold;
  user-select: none;
  &:last-of-type {
    border-bottom: 0;
  }
}
.players {
  height: 100vh;
  width: calc(100vw - 4rem);
  position: absolute;
  left: 4rem;
  top: 0;
  user-select: none;
  padding: 0 0 env(safe-area-inset-bottom) 0;
  overflow-x: auto;
  .flex {
    display: flex;
    width: 100%;
    height: 100vh;
  }
}
.player {
  position: relative;
  flex: 1 0 150px;
  display: inline-flex;
  flex-direction: column;
  border-right: 1px solid #333;
  user-select: none;
  transition: flex 1s;
  &.hit {
    .name {
      background-color: rgb(236, 84, 73);
    }
    .points {
      color: white;
    }
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  &:last-of-type {
    border: 0;
  }
}
.winning {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  img {
    width: 100%;
  }
}
.name {
  flex: 0 0 6rem;
  border-bottom: 1px solid #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  user-select: none;
  transition: background-color 1s ease;
  .points {
    font-size: 18px;
    margin-top: 0.5rem;
    color: #999;
    transition: color 1s ease;
    user-select: none;
  }
  .remove-player {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1rem;
    height: 1rem;
    img {
      max-width: 100%;
      opacity: 0.4;
    }
  }
}
.player-scores {
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
}
.player-score {
  position: relative;
  flex: 1;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  // TODO: This one is causing overflow
  &:hover {
    &:after {
      position: absolute;
      content: "";
      height: 100%;
      width: 200vw;
      background-color: #666;
      z-index: -100;
      opacity: 0.2;
    }
  }
  &:last-of-type {
    border: 0;
  }
  svg {
    width: 2rem;
    height: 2rem;
  }
}
.number-picker {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 50vh;
  border-radius: 16px;
  color: white;
  z-index: 100;
  overflow: hidden;
  user-select: none;
}
.number {
  --border-color: rgb(36, 36, 36);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: rgb(26, 26, 26);
  user-select: none;
  &:hover {
    background-color: var(--border-color);
  }
  &:nth-of-type(4n + 1) {
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  &:nth-of-type(4n + 2) {
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  &:nth-of-type(4n + 3) {
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  &:nth-of-type(4n + 4) {
    border-bottom: 1px solid var(--border-color);
  }
}
.bottom-controller {
  width: 100vw;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: black;
  border-top: 1px solid #333;
  padding: 1rem;
}
input {
  font-size: 1rem;
  -moz-appearance: none;
  background-color: #333;
  color: white;
  border-radius: 0.3rem;
  border: 0;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  outline: none;
}
.button {
  -moz-appearance: none;
  background-color: white;
  border-radius: 0.3rem;
  padding: 0.8rem 1rem;
  &:last-of-type {
    margin-right: 0;
  }
}
.ghost {
  opacity: 0;
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>
