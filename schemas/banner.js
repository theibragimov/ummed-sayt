const banner = {
  name: 'banner',
  title: 'Banner / Slider',
  type: 'document',
  fields: [
    {
      name: 'sarlavha',
      title: 'Sarlavha',
      type: 'string',
    },
    {
      name: 'tavsif',
      title: 'Tavsif',
      type: 'text',
    },
    {
      name: 'rasm',
      title: 'Rasm',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'havola',
      title: 'Havola (URL)',
      type: 'url',
    },
    {
      name: 'tartibRaqami',
      title: 'Tartib raqami',
      type: 'number',
      description: "Kichik raqam birinchi ko'rinadi",
    },
    {
      name: 'faol',
      title: 'Faol',
      type: 'boolean',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: "Tartib bo'yicha",
      name: 'orderAsc',
      by: [{ field: 'tartibRaqami', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'sarlavha',
      subtitle: 'faol',
      media: 'rasm',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Banner',
        subtitle: subtitle ? '✅ Faol' : '❌ Nofaol',
        media,
      }
    },
  },
}

export default banner
