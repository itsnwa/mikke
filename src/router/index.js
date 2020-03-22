import Vue from "vue"
import VueRouter from "vue-router"
import Lobby from "../views/Lobby"
import Room from "../views/Room"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Lobby",
    component: Lobby
  },
  {
    path: "/:roomID",
    name: "Room",
    component: Room
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
