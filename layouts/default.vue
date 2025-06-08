<template>
    <div class="platformads">
        <SiteHeader />
        <slot />
        <SiteFooter />
        <GlobalToast />
    </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'
import GlobalToast from '~/components/GlobalToast.vue'
</script>