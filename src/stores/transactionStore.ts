import { defineStore } from 'pinia';
import { useDbStore } from './dbStore';

export interface Transaction {
    id: number;
    cost: number;
    description: string;
    tags: number[];
    date: Date;
    shortDate: string;
}

export interface ITransactionStore {
    transactions: Transaction[];
    filterDialog: boolean;
    filterSearch: string | null;
    filterDateFrom: Date | undefined;
    filterDateTo: Date | undefined;
    filterTags: number[];
}

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    filterDialog: false,
    filterSearch: '',
    filterDateFrom: undefined,
    filterDateTo: undefined,
    filterTags: []
  } as ITransactionStore),
  getters: {},
  actions: {
    addTransaction(cost: number, description: string, tags: number[]) {
        const dbStore = useDbStore();
        const transaction: Transaction = {
            id: dbStore.nextId(),
            cost: cost,
            description: description,
            tags: tags,
            date: new Date(),
            shortDate: new Date().toLocaleDateString()
        }
        this.transactions.push(transaction);
        dbStore.save();
    },
    test() {
        for(let i = 0; i < 9999; i++) {
            const dbStore = useDbStore();

            const transaction: Transaction = {
                id: dbStore.nextId(),
                cost: i,
                description: 'desc' +i,
                tags: [],
                date: new Date(),
                shortDate: new Date().toLocaleDateString()
            }
            this.transactions.push(transaction);
        }
    }
  },
});
