import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'ummed-sayt',
  title: 'Ummed — Tibbiy Jihozlar',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Bosh menyu')
          .items([
            S.listItem()
              .title('Mahsulotlar')
              .child(
                S.list()
                  .title('Mahsulotlar')
                  .items([
                    S.documentTypeListItem('product').title('Barcha mahsulotlar'),
                    S.documentTypeListItem('category').title('Kategoriyalar'),
                    S.documentTypeListItem('brand').title('Brendlar'),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('Blog & Yangiliklar')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.documentTypeListItem('post').title('Maqolalar'),
                    S.documentTypeListItem('postCategory').title('Post kategoriyalari'),
                  ])
              ),
            S.divider(),
            S.documentTypeListItem('banner').title('Bannerlar / Slider'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
