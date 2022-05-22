<template>
    <div v-if="visible">
        <li key={{employee.uniqueId}}
            draggable
            v-bind:id="employee.uniqueId"
            class="info"
            ref="employee">
            <b>{{ employee.uniqueId }}</b> {{ employee.name }}
        </li>
        <template v-if="employee.subordinates.length > 0 && show">
            <EmployeeRender v-for="sub in employee.subordinates"
                v-bind:key="sub.uniqueId"
                v-bind:employee="sub" />
        </template>
    </div>
</template>

<script lang="ts">
import { Employee } from '@/classes/Employee';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EmployeeRender extends Vue {
    @Prop({}) employee!: Employee;

    show = true;

    visible = true;

    mounted(): void {
      function isVisible({ top, height }: { top: number, height: number}) {
        const offset = 50;
        console.log(top + height + offset, top - offset, window.innerHeight);
        return (top + height + offset >= 0) && (top - offset <= window.innerHeight);
      }

      if (this.$refs.employee) {
        const ref = this.$refs.employee as Element;
        ref.addEventListener('click', () => {
          this.show = !this.show;
        });
        const scrollEvent = () => {
          this.visible = isVisible(ref.getBoundingClientRect());
          console.log(this.employee.uniqueId, this.visible);
          if (this.visible) {
            window.removeEventListener('scroll', scrollEvent);
          }
        };
        window.addEventListener('scroll', scrollEvent, false);
      }
    }
}

</script>
<style>
li.info {
    border-bottom: solid 1px gray;
    cursor: pointer;
}

div {
    padding-left: 10px;
}
</style>
