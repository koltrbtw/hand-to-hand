<template>
    <div class="platformads">
        <!-- Header -->
        <SiteHeader />

        <!-- Контейнер с основной частью -->
        <div class="main">
            <div class="homepage">
                <div class="leftpage">
                    <!-- Содержимое страницы -->
                    <slot />
                </div>

                <div class="rightpage">
                    <!-- Залайканные посты -->
                    <LikedPosts/>

                    <!-- Просмотренные посты -->
                    <ViewedPosts />
                </div>
            </div>
        </div>

        <!-- Footer -->
        <SiteFooter />
    </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'
import LikedPosts from '~/components/LikedPosts.vue'
import ViewedPosts from '~/components/ViewedPosts.vue'
</script>
