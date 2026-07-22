/**
 * Public reference points used to keep Hoang Sa and Truong Sa visible even
 * when a third-party basemap omits their Vietnamese labels.
 *
 * These are the archipelago place-name points published for the 1:6,000,000
 * national map, not maritime or administrative boundary geometries. They must
 * not be used for legal survey.
 */
export const VIETNAM_SOVEREIGNTY_REFERENCES = [
  {
    id: 'sovereignty-hoang-sa',
    name: 'Quần đảo Hoàng Sa',
    label: 'HOÀNG SA\nVIỆT NAM',
    administrativeUnit: 'Đà Nẵng',
    coordinates: [112.225, 16.466667] as [number, number],
    coordinateNote: 'Điểm địa danh Quần đảo Hoàng Sa (16°28′00″B, 112°13′30″Đ)',
    sourceName: 'Bộ Nông nghiệp và Môi trường',
    sourceUrl:
      'https://mae.gov.vn/noidung/Lists/VBQPPL/Attachments/514/1_DanhMuc_TT_DiaDanh_BanHanh.pdf',
  },
  {
    id: 'sovereignty-truong-sa',
    name: 'Quần đảo Trường Sa',
    label: 'TRƯỜNG SA\nVIỆT NAM',
    administrativeUnit: 'Khánh Hòa',
    coordinates: [114.005, 8.808333] as [number, number],
    coordinateNote: 'Điểm địa danh Quần đảo Trường Sa (8°48′30″B, 114°00′18″Đ)',
    sourceName: 'Bộ Nông nghiệp và Môi trường',
    sourceUrl:
      'https://mae.gov.vn/noidung/Lists/VBQPPL/Attachments/514/1_DanhMuc_TT_DiaDanh_BanHanh.pdf',
  },
] as const;
