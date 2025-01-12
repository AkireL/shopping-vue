<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { watch, computed } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import {
    VBtn,
    VContainer,
    VRow,
    VCol,
    VTextField,
    VIcon
} from 'vuetify/components';
import type { List, Item } from "@/types/listTypes";
import Articles from "@/components/Articles.vue"

const props = withDefaults(
    defineProps<{
        id: string
    }>(),
    {
        id: "88"
    }
)

const base = () => {
    return {
        id: uuidv4(),
        title: null,
        price: null,
        noArticle: 0,
        items: [] as Item[],
    } as List;
}

const row = ref<List>(base());

onMounted(() => {
    const item = loadFromStorage() ?? base();
    row.value = item;
});

const unCheckItems = computed(() => row.value.items.filter((item) => !item.check));
const checkItems = computed(() => row.value.items.filter((item) => item.check));

const saveToLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem('lists') ?? '[]') as List[];

    let index = data.findIndex((item) => {
        return item.id === props.id;
    });

    data[index] = row.value

    localStorage.setItem('lists', JSON.stringify(data))
};

watch(row, () => {
    let total = row.value.items.reduce((previous: number, current: Item) => previous + (current.price ?? 0), 0);
    row.value.price = total;

    saveToLocalStorage();
}, { deep: true });

const loadFromStorage = () => {
    const data = JSON.parse(localStorage.getItem('lists') ?? '[]') as List[];

    return data.find((item) => {
        return item.id === props.id;
    });
}

const addItem = () => {
    let rowTmp = { ...row.value };

    rowTmp.items = [
        ...row.value.items,
        {
            'id': uuidv4(),
            'description': "",
            'price': null,
            'check': false,
        } as Item,
    ];

    rowTmp.noArticle = (rowTmp.items ?? []).length;

    const total = rowTmp.items.reduce(
        (accumulator: number, currentValue: Item) => accumulator + (currentValue.price ?? 0),
        0,);

    rowTmp.price = total;

    row.value = rowTmp;
}

const onRemoveItem = (itemSelected: Item) => {
    const filteredItems = row.value.items.filter((item) => {
        return itemSelected.id !== item?.id;
    });

    row.value.items = [...filteredItems];
}
</script>

<template>
    <div class="px-md-12">
        <v-container fluid>
            <router-link to="/"><v-icon icon="mdi-home"></v-icon></router-link>
            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field v-model="row.title" label="Nombre"></v-text-field>
                    <v-btn @click="addItem" color="green" icon="mdi-plus"></v-btn>
                    <br>
                    <br>
                    <Articles
                        title="Pendientes"
                        v-model="unCheckItems"
                        @removeItem="onRemoveItem"
                    ></Articles>
                    <br>
                    <br>
                    <Articles
                        title="Listos"
                        v-model="checkItems"
                        @removeItem="(event) => onRemoveItem(event)"
                    ></Articles>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
