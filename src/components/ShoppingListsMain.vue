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
import { humanDate } from '@/utils/date';
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const router = useRouter()
const theme = useTheme()

const headers: any = [
    { align: 'start', key: 'title', title: 'Título'},
    { key: 'noArticle', title: 'Artículo', align: 'end'  },
    { key: 'price', title: 'Precio', align: 'end' },
    { key: 'options', sortable:false, title: '' },
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
    const id = uuidv4()
    let newItem = {
        "id": id,
        "title": humanDate(),
        "noArticle": 0,
        "price": 0, 
        "items" : [{
            "id": uuidv4(),
            "description": "",
            "price": 0,
            "check": false,
        }],
    };

    shoppingLists.value = shoppingLists.value ? [...shoppingLists.value, newItem]: [newItem];
    router.push({ name: 'item', params: { id: id } });
}

const onDuplicate = (listToDuplicated: List) => {
    const tmp = {...listToDuplicated};
    tmp.id = uuidv4();
    tmp.title = tmp.title + " (Copy)";
    tmp.items = tmp.items.map((item) => {
        return {
            ...item,
            id: uuidv4(),
        };
    });

    shoppingLists.value = shoppingLists.value ? 
        [...shoppingLists.value, tmp]:
        [tmp];
}

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'customTheme'
}
</script>
<template>
    <div style="margin: 30px;">
        <v-card>
            <v-card-title>
                <div class="d-flex justify-space-between">
                    <h1>Tus listas</h1>
                    <v-btn
                        @click="toggleTheme"
                        icon="mdi-theme-light-dark"
                    >
                    </v-btn>
                </div>
            </v-card-title>
            <v-card-text>
                <div><v-btn @click="addNewList" icon="mdi-plus" color="green" size="small"></v-btn></div>
                <v-data-table
                    :headers="headers"
                    :items="shoppingLists"
                >
                <template v-slot:item.options="{ item }">
                    <v-btn
                        @click="() => $router.push({ path: `/row/${item.id}` })"
                        icon="mdi-pencil"
                        color="primary"
                        variant="plain"
                    ></v-btn>
                    <v-btn
                        @click="() => {openModal = true; itemToRemove = item}"
                        :value="item.id"
                        icon="mdi-trash-can"
                        variant="plain"
                        color="warning"
                    ></v-btn>
                    <v-btn
                        @click="() => onDuplicate(item)"
                        icon="mdi-clipboard-text-multiple"
                        color="green"
                        variant="plain"
                    ></v-btn>
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