<template>
  <div>
    <v-app-bar fixed color="deep-purple lighten-5" prominent height="55">
      <v-img src="@/assets/logo.png" contain width="10" height="45"></v-img>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" bottom fixed>
      <p class="ma-0 py-3 text-center deep-purple lighten-3 white--text">
        Módulo Acadêmico
      </p>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item link :to="{ path: '/' }">
            <v-list-item-title>Alunos</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Navigation extends Vue {
  items = [
    { title: "Dashboard", icon: "mdi-view-dashboard" },
    { title: "Photos", icon: "mdi-image" },
    { title: "About", icon: "mdi-help-box" },
  ];
  right = null;

  drawer = true;
  group = null;
}
</script>
<style lang="scss">
.v-app-bar {
  z-index: 101 !important;
}
.v-navigation-drawer.v-navigation-drawer--absolute {
  margin-top: 60px;
  background-color: #e0f2f1;
}
.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
  box-shadow: none !important;
}
.v-navigation-drawer__content {
  margin-top: 65px;
}
</style>
