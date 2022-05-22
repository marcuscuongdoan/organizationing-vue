<template>
  <ul ref="ul">
    <template v-if="ceoData">
      <EmployeeRender v-bind:key="ceoData.ceo.uniqueId"
                      v-bind:employee="ceoData.ceo" />
    </template>
  </ul>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EmployeeOrgApp from '@/classes/EmployeeOrgApp';
import EmployeeRender from './EmployeeRender.vue';
import ceo from '../ceoMock';

@Component({
  components: {
    EmployeeRender,
  },
})
export default class DragList extends Vue {
  @Prop() ceoData!: EmployeeOrgApp;

  /* eslint-disable max-len */
  /* eslint-disable class-methods-use-this */
  /* eslint-disable no-restricted-globals */
  mounted(): void {
    this.ceoData = new EmployeeOrgApp(ceo);
    console.log(this.ceoData);
    // let dragging: HTMLElement | null | false = null;
    let start: HTMLElement | null = null;
    let end: HTMLElement | null = null;
    function getLI(target: HTMLElement) {
      // if (target && target.nodeName.toLowerCase() === 'body') {
      //   return false;
      // }
      // while (target && target.nodeName.toLowerCase() !== 'li' && target.nodeName.toLowerCase() !== 'body') {

      if (target && target.id && Number.parseInt(target.id, 10) === 1) {
        return false;
      }

      while (target && target.nodeName.toLowerCase() !== 'ul' && target.nodeName.toLowerCase() !== 'li') {
        // eslint-disable-next-line no-param-reassign
        target = target.parentNode as HTMLElement;
      }
      return target as HTMLElement;
    }

    document.addEventListener('dragstart', (event) => {
      const target = (getLI(event.target as HTMLElement));
      // dragging = target;
      if (target && event) {
        start = target;
        event?.dataTransfer?.setData('text/plain', '');
      }
    });

    document.addEventListener('dragover', (event) => {
      event.preventDefault();
      const target = (getLI(event.target as HTMLElement));
      if (!target) return;
      const bounding = target.getBoundingClientRect();
      const offset = bounding.y + (bounding.height / 2);
      if (event.clientY - offset > 0) {
        target.style.borderBottom = 'solid 4px blue';
        target.style.borderTop = '';
      } else {
        target.style.borderTop = 'solid 4px blue';
        target.style.borderBottom = '';
      }
    });

    document.addEventListener('dragleave', (event) => {
      const target = (getLI(event.target as HTMLElement));
      if (target) {
        target.style.borderBottom = '';
        target.style.borderTop = '';
      }
    });

    document.addEventListener('drop', (event) => {
      event.preventDefault();
      const target = (getLI(event.target as HTMLElement));
      if (!target) return;
      // this.ceoData.move(2, 10);
      end = target;
      if (target.parentNode && target.style.borderBottom !== '') {
        if (start && start.id) {
          if (end.id) {
            this.ceoData.move(Number.parseInt(start.id, 10), Number.parseInt(end.id, 10));
          } else {
            this.ceoData.move(Number.parseInt(start.id, 10), 1);
          }
        }
        target.style.borderBottom = '';
        // target.parentNode.insertBefore(dragging, target.nextSibling);
      } else {
        console.log(target);
        if (start && start.id) {
          if (end.id) {
            this.ceoData.move(Number.parseInt(start.id, 10), Number.parseInt(end.id, 10));
          } else {
            this.ceoData.move(Number.parseInt(start.id, 10), 1);
          }
        }
        target.style.borderTop = '';
        // target?.parentNode?.insertBefore(dragging, target);
      }
      end = null;
      start = null;
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'z' && event.ctrlKey) {
        console.log('ctrl z', 'undo');
        this.ceoData.undo();
      }
      if (event.key === 'Z' && event.ctrlKey && event.shiftKey) {
        console.log('ctrl shift z');
        this.ceoData.redo();
      }
    });
  }
}
</script>
<style>
ul {
  margin: 0;
  padding: 0;
  text-align: left;
  border: 1px solid white;
}

li {
  cursor: move;
  display: block;
  padding: 20px 10px;
  background: white;
  /* border-bottom: solid 1px gray; */
}
</style>
