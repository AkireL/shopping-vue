<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { onMounted, ref, watch} from "vue"
import type { List } from "@/types/listTypes";
import { 
    VCard,
    VCardText,
    VCardTitle,
    VDataTable,
    VBtn,
} from 'vuetify/components'

const headers: any = [
    { align: 'start', key: 'title', sortable: false, title: 'Titulo'},
    { key: 'noArticle', title: 'Articulo' },
    { key: 'price', title: 'Precio' },
    { key: 'options', title: 'Opción' },
];

const desserts = ref<List[]>();

onMounted(() => {
    desserts.value = JSON.parse(localStorage.getItem("lists") ?? '[]') as List[];
});

watch(desserts, () => {
    localStorage.setItem('lists', JSON.stringify(desserts.value))
}, {deep: true});

const onClick = (event: any) =>{
    console.table(event);
} 

const addNewList = () => {
    desserts.value = [
        ...desserts.value,
        {
            "id": uuidv4(),
            "title": "",
            "noArticle": null,
            "price": null, 
            "items" : [],
        }
    ];
}
</script>
<template>
    <div style="margin: 30px;">
        <v-card>
            <v-card-title>
                Your lists
            </v-card-title>
            <v-card-text>
                <div><v-btn @click="addNewList" icon="mdi-plus" color="green" size="small"></v-btn></div>
                <v-data-table
                :headers="headers"
                :items="desserts">
                <template v-slot:item.options="{ item }">
                    <v-btn icon="mdi-pencil" variant="plain" @click="() => $router.push({ path: `/row/${item.id}` })"></v-btn>
                    <v-btn icon="mdi-trash-can" variant="plain" :value="item.id" @click="() => onClick(item)"></v-btn>
                    <v-btn icon="mdi-clipboard-text-multiple" variant="plain" model-value="item.id"></v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</div>
</template>