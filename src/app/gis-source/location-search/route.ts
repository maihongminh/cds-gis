import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ARCGIS_GEOCODER_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

interface ArcGisCandidate {
  address?: string;
  location?: {
    x?: number;
    y?: number;
  };
  score?: number;
  attributes?: {
    Addr_type?: string;
    Match_addr?: string;
    PlaceName?: string;
  };
}

interface ArcGisResponse {
  candidates?: ArcGisCandidate[];
  error?: {
    message?: string;
  };
}

const addressTypeLabels: Record<string, string> = {
  Country: 'Quốc gia',
  State: 'Tỉnh / Thành phố',
  County: 'Quận / Huyện',
  City: 'Thành phố',
  Locality: 'Địa phương',
  Suburb: 'Khu vực',
  Neighborhood: 'Khu dân cư',
  District: 'Quận / Huyện',
  MetroArea: 'Khu vực đô thị',
  StreetName: 'Đường phố',
  StreetAddress: 'Địa chỉ',
  PointAddress: 'Địa chỉ',
  POI: 'Địa điểm',
};

function zoomForAddressType(addressType?: string) {
  switch (addressType) {
    case 'Country':
      return 6;
    case 'State':
      return 8;
    case 'County':
    case 'District':
      return 10;
    case 'City':
    case 'MetroArea':
      return 11;
    case 'Locality':
      return 13;
    case 'Suburb':
      return 14;
    case 'Neighborhood':
      return 15;
    case 'StreetName':
      return 16;
    default:
      return 17;
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (query.length < 2 || query.length > 120) {
    return NextResponse.json(
      { error: 'Từ khóa tìm kiếm phải có từ 2 đến 120 ký tự.' },
      { status: 400 },
    );
  }

  const url = new URL(ARCGIS_GEOCODER_URL);
  url.searchParams.set('SingleLine', query);
  url.searchParams.set('f', 'json');
  url.searchParams.set('outSR', '4326');
  url.searchParams.set('maxLocations', '8');
  url.searchParams.set('forStorage', 'false');
  url.searchParams.set('countryCode', 'VNM');
  url.searchParams.set('langCode', 'vi');
  url.searchParams.set('outFields', 'Match_addr,Addr_type,PlaceName');

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3_600 },
    });
    if (!response.ok) {
      throw new Error(`ArcGIS responded with HTTP ${response.status}`);
    }

    const data = (await response.json()) as ArcGisResponse;
    if (data.error) {
      throw new Error(data.error.message ?? 'ArcGIS geocoder returned an error');
    }

    const results = (data.candidates ?? [])
      .map((candidate, index) => {
        const longitude = candidate.location?.x;
        const latitude = candidate.location?.y;
        if (
          typeof longitude !== 'number' ||
          typeof latitude !== 'number' ||
          !Number.isFinite(longitude) ||
          !Number.isFinite(latitude)
        ) {
          return null;
        }

        const addressType = candidate.attributes?.Addr_type;
        const label =
          candidate.attributes?.PlaceName ||
          candidate.attributes?.Match_addr ||
          candidate.address ||
          query;

        return {
          id: `arcgis-${index}-${longitude}-${latitude}`,
          label,
          address: candidate.address ?? label,
          type: addressTypeLabels[addressType ?? ''] ?? 'Địa điểm',
          latitude,
          longitude,
          zoom: zoomForAddressType(addressType),
          score: candidate.score ?? 0,
        };
      })
      .filter((result) => result !== null);

    return NextResponse.json(
      { query, provider: 'Esri World Geocoding Service', results },
      {
        headers: {
          'Cache-Control':
            'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('Unable to search locations with ArcGIS', error);
    return NextResponse.json(
      { error: 'Không thể kết nối dịch vụ tìm kiếm địa điểm.' },
      { status: 502 },
    );
  }
}
