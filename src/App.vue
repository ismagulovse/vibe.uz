<script setup lang="ts">
import AppBanner from './components/AppBanner(v2).vue';
import AppHeader from './components/AppHeader.vue'
import WhoSection from './components/WhoSection.vue';
import AppRoadmap from './components/AppRoadmap.vue';
import CoachesSection from './components/CoachesSection.vue';
import ItinerarySection from './components/ItinerarySection.vue';
import AppPricing from './components/AppPricing(2).vue';
import ContactModal from './components/ContactModal.vue';
import HowItWasSection from './components/HowItWasSection.vue';
import ProgramSection from './components/ProgramSection.vue';
</script>

<template>
  <AppHeader />
  <AppBanner />
  <HowItWasSection/>
  <!-- <WhoSection /> -->
  <!-- <AppRoadmap/> -->
  <!-- <ItinerarySection/>  -->
   <ProgramSection/>
  <!-- <CoachesSection/> -->
  <AppPricing/>
  <ContactModal/>
  <router-view />
</template>