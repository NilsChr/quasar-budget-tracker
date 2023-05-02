import { defineStore, storeToRefs } from 'pinia';
import { Tag, useTagsStore } from './tagsStore';
import { Transaction, useTransactionStore } from './transactionStore';

export interface IDBStore {
    id: number;
    income: number;
}

export interface ILocalDB {
    id: number;
    income: number;
    tags: Tag[];
    transactions: Transaction[];
}

export const useDbStore = defineStore('db', {
  state: () => ({
    id: 1,
    income: 0
  } as IDBStore),
  getters: {},
  actions: {
    nextId() {
        return this.id++;
    },
    loadData() {
        const data = localStorage.getItem('data');
        if(!data) return;
        const { tags } = storeToRefs(useTagsStore());
        const { transactions } = storeToRefs(useTransactionStore());

        const json: ILocalDB = JSON.parse(data);
        this.id = json.id;
        tags.value = json.tags;
        transactions.value = json.transactions || [];
        transactions.value.forEach(t => t.date = new Date(t.date));
        this.income = json.income || 0; 
    },
    save() {
        const { tags } = storeToRefs(useTagsStore());
        const { transactions } = storeToRefs(useTransactionStore());

        const data: ILocalDB = {
            id: this.id,
            income: this.income,
            tags: tags.value,
            transactions: transactions.value
        }

        localStorage.setItem('data', JSON.stringify(data));
    }
  },
});
