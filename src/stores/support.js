import { defineStore } from 'pinia';

export const useSupportSote = defineStore('support', {
    state: () => ({
        submissions: [],
    }),
    actions: {
        addSubmission(submission){
            this.submissions.push(submission);
        },
    },
});