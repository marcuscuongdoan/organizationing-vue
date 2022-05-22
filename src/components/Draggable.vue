<template>
    <div ref="draggableContainer" id="draggable-container">
        <div id="draggable-header" @mousedown="dragMouseDown">
            <slot name="header"></slot>
        </div>
        <slot name="main"></slot>
        <slot name="footer"></slot>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
    /* eslint-disable class-methods-use-this */
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    @Prop() private info!: string;

    positions = {
      clientX: 0,
      clientY: 0,
      movementX: 0,
      movementY: 0,
    };

    dragMouseDown(event: MouseEvent) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    }

    private elementDrag(event: MouseEvent) {
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      // set the element's new position:
      const { draggableContainer } = this.$refs;
      const draggableHTMLEL = draggableContainer as HTMLElement;
      draggableHTMLEL.style.top = `${draggableHTMLEL.offsetTop - this.positions.movementY}px`;
      draggableHTMLEL.style.left = `${draggableHTMLEL.offsetLeft - this.positions.movementX}px`;
    }

    private closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
}
</script>

<style>
#draggable-container {
    cursor: grab;
    position: absolute;
    z-index: 9;
    transition: 0s ease-in-out;
}

#draggable-header {
    z-index: 10;
    background-color: black;
}
</style>
