const product = {
  name: 'product',
  title: 'Mahsulot',
  type: 'document',
  fields: [
    {
      name: 'nom',
      title: 'Mahsulot nomi',
      type: 'string',
      validation: (Rule) => Rule.required().error('Mahsulot nomi majburiy'),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'nom', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'kategoriya',
      title: 'Kategoriya',
      type: 'reference',
      to: [{ type: 'category' }],
    },
    {
      name: 'asosiyRasm',
      title: 'Asosiy rasm',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'qoshimchaRasmlar',
      title: "Qo'shimcha rasmlar",
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.max(10).error("Maksimal 10 ta rasm qo'shish mumkin"),
    },
    {
      name: 'narx',
      title: 'Narx',
      type: 'number',
    },
    {
      name: 'narxBirligi',
      title: 'Narx birligi',
      type: 'string',
      initialValue: "so'm",
    },
    {
      name: 'mavjudligi',
      title: 'Mavjud',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'qisqaTavsif',
      title: 'Qisqa tavsif',
      type: 'string',
      validation: (Rule) => Rule.max(200).error('Maksimal 200 belgi'),
    },
    {
      name: 'toliqTavsif',
      title: "To'liq tavsif",
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Oddiy matn', value: 'normal' },
            { title: 'Sarlavha 1', value: 'h1' },
            { title: 'Sarlavha 2', value: 'h2' },
            { title: 'Sarlavha 3', value: 'h3' },
          ],
          lists: [
            { title: "Ro'yxat", value: 'bullet' },
            { title: "Raqamli ro'yxat", value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Qalin', value: 'strong' },
              { title: 'Kursiv', value: 'em' },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    },
    {
      name: 'brend',
      title: 'Brend',
      type: 'string',
    },
    {
      name: 'modelRaqami',
      title: 'Model raqami',
      type: 'string',
    },
    {
      name: 'featured',
      title: 'Bosh sahifada ko\'rsatish',
      type: 'boolean',
      description: 'Belgilansa, ushbu mahsulot bosh sahifada ko\'rsatiladi',
      initialValue: false,
    },
    {
      name: 'sertifikatlar',
      title: 'Sertifikatlar',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'seoSarlavha',
      title: 'SEO sarlavha',
      type: 'string',
    },
    {
      name: 'seoTavsif',
      title: 'SEO tavsif',
      type: 'text',
    },
  ],
  preview: {
    select: {
      title: 'nom',
      subtitle: 'brend',
      media: 'asosiyRasm',
    },
  },
}

export default product
