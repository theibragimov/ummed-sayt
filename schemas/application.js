export default {
  name: 'application',
  title: 'Zayavkalar',
  type: 'document',
  fields: [
    {
      name: 'ism',
      title: 'Ism',
      type: 'string',
    },
    {
      name: 'telefon',
      title: 'Telefon',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email (ixtiyoriy)',
      type: 'string',
    },
    {
      name: 'xabar',
      title: 'Xabar',
      type: 'text',
    },
    {
      name: 'mahsulot',
      title: 'Mahsulot (qaysi mahsulot haqida)',
      type: 'string',
    },
    {
      name: 'holat',
      title: 'Holat',
      type: 'string',
      options: {
        list: [
          { title: '🆕 Yangi', value: 'new' },
          { title: '⏳ Ko\'rib chiqilmoqda', value: 'inProgress' },
          { title: '✅ Bajarildi', value: 'done' },
          { title: '❌ Rad etildi', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    },
    {
      name: 'sana',
      title: 'Sana',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'izoh',
      title: 'Admin izohi',
      type: 'text',
      description: 'Faqat admin uchun ichki izoh',
    },
  ],
  orderings: [
    {
      title: "Sana bo'yicha (yangi)",
      name: 'dateDesc',
      by: [{ field: 'sana', direction: 'desc' }],
    },
    {
      title: 'Holat bo\'yicha',
      name: 'statusAsc',
      by: [{ field: 'holat', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'ism',
      subtitle: 'telefon',
      status: 'holat',
    },
    prepare({ title, subtitle, status }) {
      const statusEmoji = {
        new: '🆕',
        inProgress: '⏳',
        done: '✅',
        rejected: '❌',
      }
      return {
        title: `${statusEmoji[status] || ''} ${title || 'Noma\'lum'}`,
        subtitle,
      }
    },
  },
}
