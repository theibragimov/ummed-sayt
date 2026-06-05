const brand = {
  name: 'brand',
  title: 'Brend',
  type: 'document',
  fields: [
    {
      name: 'nom',
      title: 'Brend nomi',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'vebsayt',
      title: 'Vebsayt',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'nom',
      media: 'logo',
    },
  },
}

export default brand
