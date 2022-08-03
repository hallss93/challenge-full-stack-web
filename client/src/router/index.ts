import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/",
        name: "Students",
        component: () =>
          import(/* webpackChunkName: "Students" */ "../views/Students.vue"),
      },
      {
        path: "/new",
        name: "NewStudent",
        component: () =>
          import(
            /* webpackChunkName: "NewStudent" */ "../views/NewStudent.vue"
          ),
      },
      {
        path: "/student/:ra",
        name: "EditStudent",
        component: () =>
          import(
            /* webpackChunkName: "NewStudent" */ "../views/NewStudent.vue"
          ),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
