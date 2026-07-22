import { CropType, LivestockType, LandType, CultivationSeason, EthnicityCatalogItem } from '@/types/catalog';

export const MOCK_CROP_TYPES: CropType[] = [
  { code: 'ca-phe-arabica', name: 'Cà phê Arabica', description: 'Đặc sản quốc gia Lao Bảo, giá trị kinh tế đặc biệt cao', isActive: true, unit: 'Cây', isSpecialty: true },
  { code: 'chuoi-laobao', name: 'Chuối Lao Bảo', description: 'Đặc sản chuối Lao Bảo chất lượng cao, vị ngọt đặc trưng', isActive: true, unit: 'Cây', isSpecialty: true },
  { code: 'lua-ray', name: 'Lúa rẫy', description: 'Lúa rẫy truyền thống của đồng bào Vân Kiều', isActive: true, unit: 'Tấn', isSpecialty: false },
  { code: 'ngo-lai', name: 'Ngô lai', description: 'Ngô lai năng suất cao phục vụ chăn nuôi', isActive: true, unit: 'Tấn', isSpecialty: false },
  { code: 'rau-rung', name: 'Rau lủi rừng', description: 'Rau sạch bản địa trồng dưới tán rừng', isActive: true, unit: 'Kg', isSpecialty: false },
];

export const MOCK_LIVESTOCK_TYPES: LivestockType[] = [
  { code: 'bo', name: 'Bò bản địa', description: 'Bò cỏ bản địa chịu được thời tiết khắc nghiệt', isActive: true, unit: 'Con', vaccinationIntervalMonths: 6 },
  { code: 'trau', name: 'Trâu', description: 'Trâu phục vụ cày kéo và phát triển kinh tế', isActive: true, unit: 'Con', vaccinationIntervalMonths: 6 },
  { code: 'lon-ban-dia', name: 'Lợn bản địa Lao Bảo', description: 'Giống lợn bản địa thơm ngon, dễ thích nghi', isActive: true, unit: 'Con', vaccinationIntervalMonths: 4 },
  { code: 'de-co', name: 'Dê cỏ', description: 'Dê nuôi thả tự nhiên tại các sườn núi', isActive: true, unit: 'Con', vaccinationIntervalMonths: 6 },
  { code: 'ga-ban-dia', name: 'Gà bản địa', description: 'Gà thả vườn, sức đề kháng tốt', isActive: true, unit: 'Con', vaccinationIntervalMonths: 3 },
];

export const MOCK_LAND_TYPES: LandType[] = [
  { code: 'dat-lua-ray', name: 'Đất trồng lúa rẫy', description: 'Đất đồi dốc luân canh trồng lúa rẫy', isActive: true, group: 'nong-nghiep' },
  { code: 'dat-cay-lau-nam', name: 'Đất trồng cây lâu năm', description: 'Đất quy hoạch trồng Chuối, Cà phê Arabica, cây ăn quả', isActive: true, group: 'nong-nghiep' },
  { code: 'dat-rung-san-xuat', name: 'Đất rừng sản xuất', description: 'Đất lâm nghiệp giao hộ gia đình trồng rừng kinh tế', isActive: true, group: 'lam-nghiep' },
  { code: 'dat-rung-phong-ho', name: 'Đất rừng phòng hộ', description: 'Đất rừng đầu nguồn được bảo vệ nghiêm ngặt', isActive: true, group: 'lam-nghiep' },
  { code: 'dat-o-nong-thon', name: 'Đất ở nông thôn', description: 'Đất xây dựng nhà ở và công trình sinh hoạt gia đình', isActive: true, group: 'phi-nong-nghiep' },
];

export const MOCK_SEASONS: CultivationSeason[] = [
  { code: '2025-DH', year: 2025, season: 'Đông Xuân', isLocked: true },
  { code: '2025-XH', year: 2025, season: 'Xuân Hè', isLocked: true },
  { code: '2026-DH', year: 2026, season: 'Đông Xuân', isLocked: false },
  { code: '2026-XH', year: 2026, season: 'Xuân Hè', isLocked: false },
];

export const MOCK_ETHNICITIES: EthnicityCatalogItem[] = [
  { id: 'eth-1', code: 'kinh', name: 'Kinh', status: 'active' },
  { id: 'eth-2', code: 'van-kieu', name: 'Vân Kiều', status: 'active' },
  { id: 'eth-3', code: 'pa-co', name: 'Pa Cô', status: 'active' },
];

