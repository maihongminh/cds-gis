import { CropChangeRecord, CropChangeReason } from '@/types/crop-change';
import { MOCK_CROPS } from './mock-db';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(4242);

export const MOCK_CROP_CHANGES: CropChangeRecord[] = [];

const reasons: CropChangeReason[] = [
  'cropConversion',
  'naturalDisaster',
  'disease',
  'poorHarvest',
  'marketChange',
  'landChange',
  'other',
];

const reasonNotes: Record<CropChangeReason, string[]> = {
  cropConversion: [
    'Chuyển từ trồng ngô sang trồng quế',
    'Chuyển đổi đất lúa rẫy bạc màu sang trồng rau rừng',
    'Quy hoạch lại vườn trồng thêm cà phê Arabica'
  ],
  naturalDisaster: [
    'Ảnh hưởng do sạt lở đất đồi núi',
    'Bão quét gây đổ ngã vườn quế',
    'Lũ quét gây ngập úng lúa rẫy'
  ],
  disease: [
    'Bệnh thối rễ cà phê Arabica gây hại',
    'Dịch bệnh rầy nâu phá hoại lúa rẫy',
    'Nấm bệnh làm chết quế non'
  ],
  poorHarvest: [
    'Thời tiết khô hạn kéo dài làm giảm sản lượng',
    'Thu hoạch sớm do sương muối',
    'Đất thoái hóa làm giảm năng suất'
  ],
  marketChange: [
    'Giá quế giảm mạnh nên hạn chế khai thác vỏ',
    'Giá sâm tăng cao thúc đẩy thu hoạch củ sớm',
    'HTX thu mua giá tốt khuyến khích mở rộng'
  ],
  landChange: [
    'Hiến đất làm đường giao thông nông thôn',
    'Khai hoang mở rộng thêm diện tích đồi',
    'Sáp nhập thửa đất rừng gia đình'
  ],
  other: [
    'Thay đổi kỹ thuật chăm sóc',
    'Hộ gia đình thiếu lao động chăm sóc',
    'Chia tách hộ làm chia đôi vườn trồng'
  ],
};

const selectedCropsForChanges = MOCK_CROPS.slice(0, 130);

selectedCropsForChanges.forEach((crop, index) => {
  const reason = rng.element(reasons);
  const note = rng.element(reasonNotes[reason]);

  const isIncrease = rng.boolean(0.4);
  const changeFactor = rng.range(5, 45) / 100;

  const previousArea = isIncrease 
    ? Number((crop.areaHa / (1 + changeFactor)).toFixed(2))
    : Number((crop.areaHa * (1 + changeFactor)).toFixed(2));
  
  const currentArea = crop.areaHa;
  const areaChange = Number((currentArea - previousArea).toFixed(2));

  const previousOutput = isIncrease
    ? Math.round(crop.harvestOutputKg / (1 + changeFactor))
    : Math.round(crop.harvestOutputKg * (1 + changeFactor));
  
  const currentOutput = crop.harvestOutputKg;
  const outputChange = currentOutput - previousOutput;

  const changePercent = Number((areaChange / (previousArea || 1) * 100).toFixed(1));

  // Determine hamlet information based on household id or indices
  const hamletIndex = index % 8;
  const hamlet = MOCK_HAMLETS[hamletIndex];
  const villageName = hamlet.name;
  const villageCode = hamlet.code;

  MOCK_CROP_CHANGES.push({
    id: `crop-change-${index + 1}`,
    cropRecordId: crop.id,
    householdId: crop.householdId,
    villageCode,
    villageName,
    cropTypeCode: crop.cropTypeCode,
    cropTypeName: crop.cropTypeName,
    year: 2026,
    period: crop.seasonYear || '2026-XH',
    previousAreaHa: previousArea,
    currentAreaHa: currentArea,
    areaChangeHa: areaChange,
    previousOutputKg: previousOutput,
    currentOutputKg: currentOutput,
    outputChangeKg: outputChange,
    changePercent,
    reason,
    note,
    createdAt: crop.createdAt,
    updatedAt: crop.updatedAt,
  });
});
