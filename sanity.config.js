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
            // 1. Zayavkalar (birinchi — eng muhim)
            S.listItem()
              .title('📋 Zayavkalar (Buyurtmalar)')
              .id('applications')
              .child(
                S.list()
                  .title('Zayavkalar')
                  .items([
                    S.documentTypeListItem('application')
                      .title('Barcha zayavkalar'),
                    S.listItem()
                      .title('🆕 Yangi zayavkalar')
                      .child(
                        S.documentList()
                          .title('Yangi zayavkalar')
                          .filter('_type == "application" && holat == "new"')
                          .defaultOrdering([{ field: 'sana', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('⏳ Ko\'rib chiqilmoqda')
                      .child(
                        S.documentList()
                          .title("Ko'rib chiqilmoqda")
                          .filter('_type == "application" && holat == "inProgress"')
                      ),
                    S.listItem()
                      .title('✅ Bajarilganlar')
                      .child(
                        S.documentList()
                          .title('Bajarilganlar')
                          .filter('_type == "application" && holat == "done"')
                      ),
                  ])
              ),

            S.divider(),

            // 2. Mahsulotlar
            S.listItem()
              .title('🛒 Mahsulotlar')
              .child(
                S.list()
                  .title('Mahsulotlar')
                  .items([
                    S.documentTypeListItem('product').title('Barcha mahsulotlar'),
                    S.listItem()
                      .title('⭐ Featured mahsulotlar')
                      .child(
                        S.documentList()
                          .title('Featured mahsulotlar')
                          .filter('_type == "product" && featured == true')
                      ),
                    S.listItem()
                      .title('❌ Mavjud emas')
                      .child(
                        S.documentList()
                          .title('Mavjud emas')
                          .filter('_type == "product" && mavjudligi == false')
                      ),
                  ])
              ),

            S.divider(),

            // 3. Kategoriyalar
            S.documentTypeListItem('category').title('📁 Kategoriyalar'),

            S.divider(),

            // 4. Yangiliklar
            S.listItem()
              .title('📰 Yangiliklar')
              .child(
                S.list()
                  .title('Yangiliklar')
                  .items([
                    S.documentTypeListItem('post').title('Barcha maqolalar'),
                    S.listItem()
                      .title('✅ Nashr etilganlar')
                      .child(
                        S.documentList()
                          .title('Nashr etilganlar')
                          .filter('_type == "post" && holat == "published"')
                          .defaultOrdering([{ field: 'chopEtilganSana', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('📝 Qoralamalar')
                      .child(
                        S.documentList()
                          .title('Qoralamalar')
                          .filter('_type == "post" && holat == "draft"')
                      ),
                  ])
              ),

            S.divider(),

            // 5. Yangilik Rubrikalari
            S.documentTypeListItem('postCategory').title('🏷️ Yangilik Rubrikalari'),

            S.divider(),

            // 6. Tugmalar va Havolalar
            S.documentTypeListItem('button').title('🔗 Tugmalar va Havolalar'),

            S.divider(),

            // Qo'shimcha
            S.listItem()
              .title('⚙️ Sozlamalar')
              .child(
                S.list()
                  .title('Sozlamalar')
                  .items([
                    S.documentTypeListItem('brand').title('Brendlar'),
                    S.documentTypeListItem('banner').title('Bannerlar'),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
