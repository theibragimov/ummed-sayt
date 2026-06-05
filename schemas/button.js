const button = {
  name: 'button',
  title: 'Tugmalar va Havolalar',
  type: 'document',
  fields: [
    {
      name: 'nom',
      title: 'Ichki nom',
      type: 'string',
      description: "Masalan: 'Bosh sahifa hero tugmasi'",
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'matn',
      title: 'Tugma matni',
      type: 'string',
      description: "Tugmada ko'rinadigan yozuv",
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'havola',
      title: 'Havola (URL)',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true }).error("To'g'ri URL kiriting"),
    },
    {
      name: 'yangiTabda',
      title: 'Yangi tabda ochish',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'faol',
      title: 'Faol',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: { title: 'nom', subtitle: 'matn' },
    prepare({ title, subtitle }) {
      return { title, subtitle }
    },
  },
}

export default button
