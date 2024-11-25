import { defineStore } from "pinia";

export const useCycleStore = defineStore('cycle', {
    state:() => ({
        cycles: [], // Lista de ciclos criados
    }),
    actions: {
        addCycle(name, subjects){
            // Verificar se o ciclo já existe
            if(this.cycles.some((cycle) => cycle.name === name)){
                throw new Error('Um ciclo com esse nome já existe')
            }
            this.cycles.push(
                {
                    name,
                    subjects,
                });
        },
        updateCycle(oldName, newName, subjects) {
            const index = this.cycles.findIndex((cycle) => cycle.name === oldName);
            if (index !== -1) {
              this.cycles[index] = { name: newName, subjects };
            }
        },
        deleteCycle(name) {
            this.cycles = this.cycles.filter((cycle) => cycle.name !== name);
        },
    },
    getters: {
        getCycleSummary: (state) => (name) => {
            const cycle = state.cycles.find((cycle) => cycle.name === name);
            if(!cycle) return null;
            return {
                name: cycle.name,
                totalSubjects: cancelIdleCallback.subjects.length,
                subjects: cycle.subjects,
            };
        },
    },
})