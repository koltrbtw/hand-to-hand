<template>
    <div class="listfilter">
        <!-- Название -->
        <div class="blockfilter">
            <h2>Название</h2>
            <div class="inputvalue">
                <input style="width: 100%"
                    type="text"
                    placeholder="Введите название"
                    :value="props.filters.name || ''"
                    @input="e => props.onUpdate('name', e.target.value)"
                />
            </div>
        </div>

        <!-- Категория -->
        <div class="blockfilter" ref="categoryDropdownRef">
            <h2>Категория</h2>
            <div class="inputfilter" @click="toggleCategoryDropdown" :class="{ active: isCategoryDropdownOpen }">
                <p>{{ selectedCategoryName || 'Все категории' }}</p>
                <svg width="13" height="7" viewBox="0 0 13 7"><path d="M1 1L6.5 6L12 1" stroke="#6B6B6B" /></svg>
                <ul v-show="isCategoryDropdownOpen">
                    <li @click="toggleCategoryDropdown" @click.stop="props.onUpdate('c-categoryId', '')"><p>Все категории</p></li>
                    <li v-for="cat in props.categories" :key="cat.id" @click="toggleCategoryDropdown" @click.stop="handleCategoryChange(cat.id)">
                        <p>{{ cat.name }}</p>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Цена -->
        <div class="blockfilter">
            <h2>Цена, ₽</h2>
            <div class="inputvalue">
                <input type="number" placeholder="От" :value="props.filters['min-price'] || ''" @input="e => props.onUpdate('min-price', e.target.value)" />
                <input type="number" placeholder="До" :value="props.filters['max-price'] || ''" @input="e => props.onUpdate('max-price', e.target.value)" />
            </div>
        </div>

        <!-- Параметры -->
        <div v-for="param in props.parameters" :key="param.id" class="blockfilter" :ref="el => setDropdownRef(param.id, el)">
            <h2>{{ param.name }}</h2>

            <div class="inputvalue" v-if="param.typeId === 1">
                <input style="width: 100%"
                    type="text"
                    :placeholder="param.name"
                    :value="props.filters[`p-${param.id}`] || ''"
                    @input="e => props.onUpdate(`p-${param.id}`, e.target.value)"
                />
            </div>

            <div v-else-if="param.typeId === 2" class="inputfilter" @click="toggleDropdown(param.id)" :class="{ active: isOpen(param.id) }">
                <p>{{ props.filters[`p-${param.id}`] || 'Любой' }}</p>
                <svg width="13" height="7" viewBox="0 0 13 7"><path d="M1 1L6.5 6L12 1" stroke="#6B6B6B" /></svg>
                <ul v-show="isOpen(param.id)">
                    <li @click="toggleDropdown(param.id)" @click.stop="props.onUpdate(`p-${param.id}`, '')"><p>Любой</p></li>
                    <li v-for="option in param.value" :key="option" @click="toggleDropdown(param.id)" @click.stop="props.onUpdate(`p-${param.id}`, option)">
                        <p >{{ option }}</p>
                    </li>
                </ul>
            </div>

            <div v-else-if="param.typeId === 3" class="inputvalue">
                <input type="number" placeholder="От" :value="props.filters[`p-${param.id}-min`] || ''" @input="e => props.onUpdate(`p-${param.id}-min`, e.target.value)" />
                <input type="number" placeholder="До" :value="props.filters[`p-${param.id}-max`] || ''" @input="e => props.onUpdate(`p-${param.id}-max`, e.target.value)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

function useClickOutside(elRef: Ref<HTMLElement | undefined>, callback: () => void) {
    const handler = (e: MouseEvent) => {
        if (elRef.value && !elRef.value.contains(e.target as Node)) {
            callback()
        }
    }

    onMounted(() => document.addEventListener('click', handler))
    onBeforeUnmount(() => document.removeEventListener('click', handler))
}

const props = defineProps<{
    filters: Record<string, any>
    parameters: Array<{ id: number; typeId: number; name: string; value: any }>
    categories: Array<{ id: number; name: string }>
    onUpdate: (key: string, value: any) => void
}>()

const selectedCategoryName = computed(() => {
    const categoryId = Number(props.filters['c-categoryId'])
    if (!categoryId) return null
    return props.categories.find(c => c.id === categoryId)?.name || null
})

// Категории
const isCategoryDropdownOpen = ref(false)
function toggleCategoryDropdown() {
    isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value
}
const categoryDropdownRef = ref<HTMLElement>()
useClickOutside(categoryDropdownRef, () => {
    isCategoryDropdownOpen.value = false
})

// Параметры
const openDropdowns = ref<Set<number>>(new Set())
const dropdownRefs = ref<Record<number, HTMLElement>>({})

function toggleDropdown(id: number) {
    openDropdowns.value.has(id)
        ? openDropdowns.value.delete(id)
        : openDropdowns.value.add(id)
}
function isOpen(id: number) {
    return openDropdowns.value.has(id)
}
function setDropdownRef(id: number, el: HTMLElement | null) {
    if (el) {
        dropdownRefs.value[id] = el
        const refWrapper = ref(el)
        useClickOutside(refWrapper, () => openDropdowns.value.delete(id))
    }
}

function handleCategoryChange(id: number) {
    const newFilters: Record<string, any> = {
        'c-categoryId': id,
    }

    for (const key of ['name', 'min-price', 'max-price']) {
        if (props.filters[key]) {
            newFilters[key] = props.filters[key]
        }
    }

    for (const key in props.filters) {
        if (!(key in newFilters)) {
            props.onUpdate(key, '') // сброс остальных
        }
    }

    for (const key in newFilters) {
        props.onUpdate(key, newFilters[key])
    }
}

</script>

