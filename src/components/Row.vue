<script setup lang="ts">
import { watch } from 'vue';
import { onMounted } from 'vue';
import { computed, ref, nextTick } from 'vue';
import { VTable, VCheckbox, VBtn, VDialog, VCard, VCardText, VCardActions} from 'vuetify/components'

const props = withDefaults(defineProps<{
  id: number
}>(), {
    id:88
});


const row = ref([]);
const open = ref<boolean>(false);
const itemSelected = ref<Object>(null);
let checkItems = ref([]);
let unCheckItems = ref([]);


onMounted(() => {
    const items = readLocalStorage();
    
    if (! items) {
        return;
    }

    row.value = items[0];
    
    checkItems.value = row.value.items.filter((item) => item.check);
    unCheckItems.value = row.value.items.filter((item) => ! item.check);

});

watch(row, () => {
    // update localstorage
    const data = JSON.parse(localStorage.getItem("lists"));

    let index = data.findIndex((item) => {
        return item.id ===  props.id
    });

    data[index] = row.value;

    localStorage.setItem("lists", JSON.stringify(data));

    checkItems.value = row.value.items.filter((item) => item.check);
    unCheckItems.value = row.value.items.filter((item) => ! item.check);
});

const readLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("lists"));
    
    return data.filter((item) => {
        return item.id ===  props.id
    });
} 

const activateTrash = (item: object) => {
    open.value = true;
    itemSelected.value = item;
}

const trash = () => {
    open.value = false;
    let rowCopy = [...row.value.items];
    
    rowCopy = rowCopy.filter((item) => {
        return item.id !== itemSelected.value.id;
    });
    
    row.value = {...row.value, 'items': rowCopy};

    itemSelected.value = null;
} 

</script>

<template>
    <!-- No check items -->
    <v-table v-if="checkItems.length > 0" density="compact">
        <thead style="background-color: red;">
            <tr>
                <th></th>
                <th>Descripción</th>
                <th>Precio</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, key) in checkItems" :key="key">
                <td><v-checkbox color="indigo"></v-checkbox></td>
                <td>{{item.description}}</td>
                <td>{{item.price}} 500</td>
                <td>
                    <v-btn icon="mdi-trash-can" variant="plain" :value="item.id" @click="() => activateTrash(item)"></v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>

    <!-- check items -->
    <v-table v-if="unCheckItems.length > 0" density="compact">
        <thead>
            <tr>
                <th></th>
                <th>Descripción</th>
                <th>Precio</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, key) in unCheckItems" :key="key">
                <td><v-checkbox color="green"></v-checkbox></td>
                <td>{{item.description}}</td>
                <td>{{item.price}}</td>
                <td></td>
            </tr>
        </tbody>
    </v-table>

    <!-- Modal -->
    <v-dialog
        v-model="open"
        width="auto"
      >
        <v-card>
          <v-card-text>
            Eliminación
        </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="trash">Aceptar</v-btn>
            <v-btn color="primary" @click="() => {
                open = false;
                itemSelected = null;
            }">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>