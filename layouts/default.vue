<template>
    <div class="platformads">
        <SiteHeader />
        <slot />
        <SiteFooter />
    </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'
</script>