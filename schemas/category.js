export default {
  name: 'category',
  title: 'Kategoriya',
  type: 'document',
  fields: [
    {
      name: 'nom',
      title: 'Kategoriya nomi',
      type: 'string',
      validation: (Rule) => Rule.required().error('Kategoriya nomi majburiy'),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'nom', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'rasm',
      title: 'Rasm',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'parentKategoriya',
      title: 'Asosiy kategoriya (subcategory uchun)',
      type: 'reference',
      to: [{ type: 'category' }],
      description: "Agar bu subcategory bo'lsa, asosiy kategoriyani tanlang",
    },
    {
      name: 'tavsif',
      title: 'Tavsif',
      type: 'text',
    },
    {
      name: 'tartibRaqami',
      title: 'Tartib raqami',
      type: 'number',
      description: 'Sidebar da tartib uchun (kichik raqam — yuqorida)',
      initialValue: 100,
    },
  ],
  orderings: [
    {
      title: 'Tartib raqami bo\'yicha',
      name: 'tartibAsc',
      by: [{ field: 'tartibRaqami', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'nom',
      subtitle: 'parentKategoriya.nom',
      media: 'rasm',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `→ ${subtitle}` : '',
        media,
      }
    },
  },
}
