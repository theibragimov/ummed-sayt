const post = {
  name: 'post',
  title: 'Blog / Yangilik',
  type: 'document',
  fields: [
    {
      name: 'sarlavha',
      title: 'Sarlavha',
      type: 'string',
      validation: (Rule) => Rule.required().error('Sarlavha majburiy'),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'sarlavha',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'muqovaRasm',
      title: 'Muqova rasm',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'qisqaTavsif',
      title: 'Qisqa tavsif',
      type: 'text',
      validation: (Rule) => Rule.max(300).error('Maksimal 300 belgi'),
    },
    {
      name: 'toliqMatn',
      title: "To'liq matn",
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Oddiy matn', value: 'normal' },
            { title: 'Sarlavha 1', value: 'h1' },
            { title: 'Sarlavha 2', value: 'h2' },
            { title: 'Sarlavha 3', value: 'h3' },
            { title: 'Sarlavha 4', value: 'h4' },
          ],
          lists: [
            { title: "Ro'yxat", value: 'bullet' },
            { title: "Raqamli ro'yxat", value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Qalin', value: 'strong' },
              { title: 'Kursiv', value: 'em' },
              { title: 'Tagiga chizilgan', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Havola',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt matn',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Izoh',
            },
          ],
        },
      ],
    },
    {
      name: 'kategoriya',
      title: 'Post kategoriyasi',
      type: 'reference',
      to: [{ type: 'postCategory' }],
    },
    {
      name: 'muallif',
      title: 'Muallif',
      type: 'string',
    },
    {
      name: 'chopEtilganSana',
      title: "Chop etilgan sana",
      type: 'datetime',
    },
    {
      name: 'holat',
      title: 'Holat',
      type: 'string',
      options: {
        list: [
          { title: 'Qoralama', value: 'draft' },
          { title: "Nashr etilgan", value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    },
  ],
  orderings: [
    {
      title: "Sana bo'yicha (yangi)",
      name: 'dateDesc',
      by: [{ field: 'chopEtilganSana', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'sarlavha',
      subtitle: 'holat',
      media: 'muqovaRasm',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === 'published' ? '✅ Nashr etilgan' : '📝 Qoralama',
        media,
      }
    },
  },
}

export default post
