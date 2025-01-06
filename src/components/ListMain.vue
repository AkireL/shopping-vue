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
    VCardActions,
    VDialog,
} from 'vuetify/components'

const headers: any = [
    { align: 'start', key: 'title', title: 'Titulo'},
    { key: 'noArticle', title: 'Articulo', align: 'end'  },
    { key: 'price', title: 'Precio', align: 'end' },
    { key: 'options', sortable:false, title: 'Opciones' },
];

const shoppingLists = ref<List[]>();
const openModal = ref<boolean>(false);
const itemToRemove = ref<List | null>(null);

onMounted(() => {
    shoppingLists.value = JSON.parse(localStorage.getItem("lists") ?? '[]') as List[];
});

watch(shoppingLists, () => {
    localStorage.setItem('lists', JSON.stringify(shoppingLists.value))
}, {deep: true});

const onRemove = () => {
    if (! itemToRemove.value || !shoppingLists.value) {
        openModal.value = false;
        itemToRemove.value = null;
        return;
    }

    let index: number = shoppingLists.value.findIndex((actual: List) => actual.id === itemToRemove.value?.id);

    if (index > 0) {
        shoppingLists.value.splice(index, 1);
    }
    
    itemToRemove.value = null;
    openModal.value = false;
}

const addNewList = () => {
    const date = new Date();

    const humanReadableDate = date.toLocaleDateString('es-ES', { // 'es-ES' es el formato para español
        weekday: 'long',  // Día de la semana
        year: 'numeric',  // Año completo
        month: 'long',    // Nombre completo del mes
        day: 'numeric'    // Día del mes
    });

    let newItem = {
        "id": uuidv4(),
        "title": humanReadableDate,
        "noArticle": 0,
        "price": 0, 
        "items" : [],
    };

    shoppingLists.value = shoppingLists.value ? [...shoppingLists.value, newItem]: [newItem];
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
                    :items="shoppingLists">
                <template v-slot:item.options="{ item }">
                    <v-btn icon="mdi-pencil" variant="plain" @click="() => $router.push({ path: `/row/${item.id}` })"></v-btn>
                    <v-btn icon="mdi-trash-can" variant="plain" :value="item.id" @click="() => {openModal = true; itemToRemove = item}"></v-btn>
                    <v-btn icon="mdi-clipboard-text-multiple" variant="plain" model-value="item.id"></v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</div>
<!-- Modal -->
<v-dialog v-model="openModal" width="auto">
    <v-card title="Confirmación">
        <v-card-text>¿Desea eliminar? </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="onRemove">Aceptar</v-btn>
            <v-btn color="primary" @click="() => {openModal = false}">Cancelar</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>