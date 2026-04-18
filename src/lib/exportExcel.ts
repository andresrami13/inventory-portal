import type { CartEntry } from '../store/cart.store'

export async function exportCartToExcel(items: CartEntry[], userName: string) {
  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Pedido')

  sheet.columns = [
    { header: 'Producto', key: 'name', width: 35 },
    { header: 'Precio unitario', key: 'price', width: 18 },
    { header: 'Cantidad', key: 'quantity', width: 12 },
    { header: 'Subtotal', key: 'subtotal', width: 18 },
  ]

  const headerRow = sheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 22

  items.forEach(({ product, quantity }) => {
    sheet.addRow({
      name: product.name,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    })
  })

  sheet.getColumn('price').numFmt = '"$"#,##0.00'
  sheet.getColumn('subtotal').numFmt = '"$"#,##0.00'

  const totalRow = sheet.addRow({
    name: 'TOTAL',
    price: null,
    quantity: null,
    subtotal: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  })
  totalRow.font = { bold: true }
  totalRow.getCell('subtotal').numFmt = '"$"#,##0.00'

  workbook.creator = userName
  workbook.created = new Date()

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const date = new Date().toISOString().split('T')[0]
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pedido-${date}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
