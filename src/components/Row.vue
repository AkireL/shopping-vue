<script setup lang="ts">
import { watch, computed } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import {
    VTable,
    VCheckbox,
    VBtn,
    VDialog,
    VCard,
    VCardText,
    VCardActions,
    VTextField,
    VAutocomplete,
    VContainer,
    VIcon,
    VRow, VCol
} from 'vuetify/components'

const props = withDefaults(
    defineProps<{
        id: number
    }>(),
    {
        id: 88
    }
)

const base = () => {
    return {
        items: []
    }
}

const row = ref(base())
const open = ref<boolean>(false)
const itemSelected = ref<Object>({})
const suggestion_items = [
    'Jitomate',
    'zanahoria',
    'tomate',
    'papa',
    'espinaca',
    'calabaza',
    'lechuga',
    'cebolla',
    'ajo',
    'pescado',
    'camarón',
    'pepicha',
    'huaxontle',
    'maíz',
    'alaches',
    'acelga',
    'platano',
    'manzana',
    'frijol'
]

// Load localStorage data
onMounted(() => {
    const item = readLocalStorage() ?? base()

    row.value = item
})

const unCheckItems = computed(() => row.value.items.filter((item) => !item.check))
const checkItems = computed(() => row.value.items.filter((item) => item.check))

// Event update when
watch(row, () => {
    // update localstorage
    const data = JSON.parse(localStorage.getItem('lists'))

    let index = data.findIndex((item) => {
        return item.id === props.id
    })

    data[index] = row.value

    localStorage.setItem('lists', JSON.stringify(data))
})

// read LocalStorage
const readLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem('lists'))

    return data.find((item) => {
        return item.id === props.id
    })
}

// Activate modal to confirm to deleted
const activateTrash = (item: object) => {
    open.value = true
    itemSelected.value = item
}

// method to trash
const trash = () => {
    // close modal
    open.value = false

    let filteredItems = [...row.value.items]

    filteredItems = filteredItems.filter((item) => {
        return item.id !== itemSelected.value.id
    })

    row.value.items = [...filteredItems]

    itemSelected.value = {}
}

// Update row
const updateRowCheckbox = (item: Object) => {
    item.check = !item.check
}
</script>

<template>
    <div style="padding: 100px">
        <v-container fluid>
            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field v-model="row.title" label="Nombre de la lista"></v-text-field>
                    <p>Tu lista <v-icon icon="mdi-house"></v-icon></p>
                    <!-- No check items -->
                    <v-table v-if="checkItems.length > 0" density="compact" style="margin-top: 50px">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, key) in checkItems" :key="key">
                                <td>
                                    <v-checkbox color="green" :model-value="item.check"
                                        @update:model-value="() => updateRowCheckbox(item)"></v-checkbox>
                                </td>
                                <td>
                                    <v-autocomplete v-model="item.description" :items="suggestion_items"
                                        label="item"></v-autocomplete>
                                </td>
                                <td style="width: 15%">
                                    <v-text-field v-model.number="item.price" density="compact"
                                        type="number"></v-text-field>
                                </td>
                                <td>
                                    <v-btn icon="mdi-trash-can" variant="plain" :value="item.id"
                                        @click="() => activateTrash(item)" style="margin: 0; padding: 0"></v-btn>
                                </td>
                            </tr>
                            <tr class="bg-blue-lighten-4">
                                <td colspan="3" style="text-align: end">Total</td>
                                <td style="text-align: start"></td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- check items -->
                    <v-card>
                        <v-card-text>
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
                                        <td>
                                            <v-checkbox color="green" :model-value="item.check"
                                                @update:modelValue="() => updateRowCheckbox(item)"></v-checkbox>
                                        </td>
                                        <td>
                                            <v-text-field v-model="item.description" density="compact"></v-text-field>
                                        </td>
                                        <td style="width: 15%">
                                            <v-text-field v-model.number="item.price" density="compact"
                                                type="number"></v-text-field>
                                        </td>
                                        <td>
                                            <v-btn icon="mdi-trash-can" variant="plain" :value="item.id"
                                                @click="() => activateTrash(item)"></v-btn>
                                        </td>
                                    </tr>
                                    <tr class="bg-green-lighten-4">
                                        <td colspan="3" style="text-align: end">Total</td>
                                        <td style="text-align: start"></td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
    <!-- Modal -->
    <v-dialog v-model="open" width="auto">
        <v-card title="Atención">
            <v-card-text> ¿Desea eliminar? </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="trash">Aceptar</v-btn>
                <v-btn color="primary" @click="() => {
                        open = false
                        itemSelected = {}
                    }
                    ">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
