export default {
  name: 'postCategory',
  title: 'Post Kategoriyasi',
  type: 'document',
  fields: [
    {
      name: 'nom',
      title: 'Kategoriya nomi',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'nom',
        maxLength: 96,
      },
    },
  ],
  preview: {
    select: { title: 'nom' },
  },
}
