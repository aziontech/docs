<template>
    <ContentSection
      :overline="overline"
      :titleTag="titleTag"
      :title="title"
      :description="description"
      :descriptionRawHtml="descriptionRawHtml"
      :id="id"
      :margin="margin"
      :hasContainer="false"
    >
      <template #actions>
        <template
          v-for="(button, index) in buttons"
          :key="index"
        >
          <LinkButton
            v-if="button.link"
            v-bind="button"
          />
        </template>
      </template>
      <template #main>
        <div class="2xl:w-1/2"></div>
      </template>
    </ContentSection>
    <div
      v-if="$slots.content"
      class="min-w-full flex xl:flex-row flex-col gap-4"
    >
      <slot name="content" />
    </div>
  </template>
  
  <script setup>
    import ContentSection from 'azion-webkit/contentsection'
    import LinkButton from 'azion-webkit/linkbutton'
  
    defineProps({
      id: {
        type: String,
        default: () => ''
      },
      isContentCentralized: {
        type: Boolean,
        default: () => true
      },
      overline: {
        type: String,
        default: () => ''
      },
      titleTag: {
        type: String,
        default: () => 'h2',
        validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
      },
      title: {
        type: String,
        rquired: true
      },
      description: {
        type: String,
        default: () => ''
      },
      descriptionRawHtml: {
        type: String,
        default: () => ''
      },
      buttons: {
        type: Array,
        default: () => []
      },
      margin: {
        type: String,
        options: ['none', 'small', 'default', 'large'],
        default: () => 'none'
      }
    })
</script>
  
<style scoped>
    /* Target prose paragraphs within this component */
    :deep(.prose-lg p) {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }
    
    /* Alternative approach - target all paragraphs within the component */
    :deep(p) {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }

    @media screen and (max-width: 640px) { 
      :deep(th), :deep(td) {
        width: 100%;
      }
    }
</style>