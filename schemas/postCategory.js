export default {
  name: 'postCategory',
  title: 'Yangilik Rubrikalari',
  type: 'document',
  fields: [
    {
      name: 'nom',
      title: 'Rubrika nomi',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'nom', maxLength: 96 },
    },
    {
      name: 'rang',
      title: 'Rang (hex kod)',
      type: 'string',
      description: "Masalan: #E8491D yoki #3DB851",
      placeholder: '#E8491D',
    },
  ],
  preview: {
    select: { title: 'nom', subtitle: 'rang' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle || '' }
    },
  },
}
