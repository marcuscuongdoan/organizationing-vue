<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <!-- <Draggable>
      <template slot="header">
        [[[ SOME CONTENT HERE]]]
      </template>
      <template slot="main">
        [[[ SOME CONTENT HERE]]]
      </template>
      <template slot="footer">
        [[[ SOME CONTENT HERE]]]
      </template>
    </Draggable> -->
    <DragList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import Draggable from './components/Draggable.vue';
import DragList from './components/DragList.vue';

@Component({
  components: {
    HelloWorld,
    Draggable,
    DragList,
  },
})
export default class App extends Vue { }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
