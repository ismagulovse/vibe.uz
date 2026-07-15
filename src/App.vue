<script setup lang="ts">
import AppBanner from './components/AppBanner.vue';
import AppHeader from './components/AppHeader.vue'
import WhoSection from './components/WhoSection.vue';
import AppRoadmap from './components/AppRoadmap.vue';
import CoachesSection from './components/CoachesSection.vue';
import ItinerarySection from './components/ItinerarySection.vue';
import AppPricing from './components/AppPricing.vue';
import ContactModal from './components/ContactModal.vue';
</script>

<template>
  <AppHeader />
  <AppBanner />
  <WhoSection />
  <!-- <AppRoadmap/> -->
  <ItinerarySection/> 
  <CoachesSection/>
  <AppPricing/>
  <ContactModal/>
  <router-view />
</template>