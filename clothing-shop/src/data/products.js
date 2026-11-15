export const CATEGORIES = ['상의', '하의', '아우터', '액세서리']

export const COLOR_HEX = {
  블랙: '#222222',
  화이트: '#f4f4f2',
  그레이: '#9a9a9a',
  차콜: '#4a4a4d',
  베이지: '#d8c8ae',
  네이비: '#26324d',
  카키: '#6f7157',
  브라운: '#7a5a42',
  아이보리: '#ece3d0',
  블루: '#5b7fa8',
}

export const SIZES = ['S', 'M', 'L', 'XL']
export const ALL_COLORS = Object.keys(COLOR_HEX)

// type: GarmentImage 에서 그리는 의류 형태
// soldOut: "컬러|사이즈" 형태의 품절 옵션
const s = SIZES
const FREE = ['FREE']

export const PRODUCTS = [
  { id: 1, name: '베이직 코튼 반팔 티셔츠', category: '상의', type: 'tee', price: 29000, colors: ['화이트', '블랙', '그레이'], sizes: s, soldOut: ['블랙|XL'], isNew: true, isBest: true, description: '20수 코튼으로 만든 데일리 반팔 티셔츠. 얇지 않은 두께감으로 속이 비치지 않습니다.' },
  { id: 2, name: '오버핏 헤비 티셔츠', category: '상의', type: 'tee', price: 39000, salePrice: 29900, colors: ['차콜', '아이보리'], sizes: s, soldOut: [], isNew: false, isBest: true, description: '어깨선이 내려오는 오버핏 실루엣. 12수 헤비 코튼으로 탄탄한 핏을 유지합니다.' },
  { id: 3, name: '옥스포드 셔츠', category: '상의', type: 'shirt', price: 49000, colors: ['블루', '화이트'], sizes: s, soldOut: ['블루|S', '블루|M'], isNew: true, isBest: false, description: '단정한 옥스포드 원단의 버튼다운 셔츠. 단독으로도 레이어드로도 활용하기 좋습니다.' },
  { id: 4, name: '루즈핏 린넨 셔츠', category: '상의', type: 'shirt', price: 55000, colors: ['베이지', '카키'], sizes: s, soldOut: [], isNew: false, isBest: false, description: '통기성이 좋은 린넨 혼방 셔츠. 여유 있는 핏으로 여름 내내 입기 좋습니다.' },
  { id: 5, name: '프렌치 테리 후디', category: '상의', type: 'hoodie', price: 59000, salePrice: 47200, colors: ['그레이', '네이비', '블랙'], sizes: s, soldOut: ['그레이|S'], isNew: false, isBest: true, description: '부드러운 프렌치 테리 소재의 후드 티셔츠. 캥거루 포켓과 두툼한 후드가 특징입니다.' },
  { id: 6, name: '크루넥 맨투맨', category: '상의', type: 'sweat', price: 45000, colors: ['아이보리', '차콜', '네이비'], sizes: s, soldOut: [], isNew: true, isBest: true, description: '기모 없는 사계절용 맨투맨. 목 늘어남을 줄인 립 마감이 적용되었습니다.' },
  { id: 7, name: '스트라이프 롱슬리브', category: '상의', type: 'long', price: 35000, colors: ['화이트', '네이비'], sizes: s, soldOut: ['네이비|L'], isNew: false, isBest: false, description: '가볍게 입기 좋은 스트라이프 긴팔 티셔츠.' },
  { id: 8, name: '하프넥 니트', category: '상의', type: 'sweat', price: 62000, colors: ['베이지', '브라운'], sizes: s, soldOut: [], isNew: true, isBest: false, description: '고급스러운 광택의 하프넥 니트. 피부에 닿는 촉감이 부드럽습니다.' },

  { id: 9, name: '와이드 데님 팬츠', category: '하의', type: 'pants', price: 59000, salePrice: 44250, colors: ['블루', '블랙'], sizes: s, soldOut: ['블루|XL'], isNew: false, isBest: true, description: '넉넉한 통으로 떨어지는 와이드 데님. 밑단 처리가 깔끔합니다.' },
  { id: 10, name: '코튼 치노 팬츠', category: '하의', type: 'pants', price: 49000, colors: ['베이지', '카키', '네이비'], sizes: s, soldOut: [], isNew: true, isBest: true, description: '구김이 적은 코튼 트윌 치노. 슬림 스트레이트 핏.' },
  { id: 11, name: '원턱 슬랙스', category: '하의', type: 'pants', price: 55000, colors: ['블랙', '그레이'], sizes: s, soldOut: ['그레이|S'], isNew: false, isBest: false, description: '허리 원턱 디테일의 테이퍼드 슬랙스. 출근룩과 캐주얼 모두 소화합니다.' },
  { id: 12, name: '스웻 조거 팬츠', category: '하의', type: 'jogger', price: 42000, colors: ['그레이', '차콜'], sizes: s, soldOut: [], isNew: false, isBest: true, description: '밴딩 허리와 밑단 리브가 편안한 조거 팬츠.' },
  { id: 13, name: '카고 팬츠', category: '하의', type: 'pants', price: 65000, salePrice: 52000, colors: ['카키', '블랙'], sizes: s, soldOut: ['카키|M'], isNew: true, isBest: false, description: '실용적인 양쪽 카고 포켓. 여유 있는 핏의 워크웨어 팬츠.' },
  { id: 14, name: '코튼 하프 팬츠', category: '하의', type: 'shorts', price: 35000, colors: ['베이지', '네이비'], sizes: s, soldOut: [], isNew: false, isBest: false, description: '무릎 위로 떨어지는 기본 하프 팬츠.' },
  { id: 15, name: '리넨 와이드 쇼츠', category: '하의', type: 'shorts', price: 39000, colors: ['아이보리', '카키'], sizes: s, soldOut: [], isNew: true, isBest: false, description: '시원한 린넨 소재의 와이드 쇼츠.' },
  { id: 16, name: '플리츠 와이드 슬랙스', category: '하의', type: 'pants', price: 69000, colors: ['차콜', '브라운'], sizes: s, soldOut: ['차콜|L', '차콜|XL'], isNew: false, isBest: false, description: '핀턱 디테일로 떨어짐이 좋은 와이드 슬랙스.' },

  { id: 17, name: '워크 코튼 자켓', category: '아우터', type: 'jacket', price: 89000, colors: ['카키', '블랙'], sizes: s, soldOut: [], isNew: true, isBest: true, description: '두꺼운 코튼 캔버스로 만든 워크 자켓. 입을수록 자연스럽게 길이 듭니다.' },
  { id: 18, name: '데님 트러커 자켓', category: '아우터', type: 'jacket', price: 79000, salePrice: 63200, colors: ['블루', '블랙'], sizes: s, soldOut: ['블루|S'], isNew: false, isBest: false, description: '클래식한 트러커 실루엣의 데님 자켓.' },
  { id: 19, name: '싱글 롱 코트', category: '아우터', type: 'coat', price: 159000, colors: ['블랙', '브라운'], sizes: s, soldOut: [], isNew: true, isBest: true, description: '무릎까지 오는 싱글 브레스티드 코트. 울 혼방으로 보온성이 좋습니다.' },
  { id: 20, name: '숏 패딩 점퍼', category: '아우터', type: 'jacket', price: 119000, salePrice: 95200, colors: ['블랙', '네이비'], sizes: s, soldOut: ['블랙|M'], isNew: false, isBest: true, description: '가볍고 따뜻한 숏 패딩. 어디에나 매치하기 좋은 기본 디자인.' },

  { id: 21, name: '볼캡', category: '액세서리', type: 'cap', price: 25000, colors: ['블랙', '베이지', '네이비'], sizes: FREE, soldOut: [], isNew: true, isBest: false, description: '사이즈 조절이 가능한 코튼 볼캡.' },
  { id: 22, name: '캔버스 에코백', category: '액세서리', type: 'bag', price: 19000, colors: ['아이보리', '블랙'], sizes: FREE, soldOut: ['블랙|FREE'], isNew: false, isBest: true, description: '가볍고 튼튼한 캔버스 에코백. 내부 포켓이 있습니다.' },
  { id: 23, name: '립 비니', category: '액세서리', type: 'beanie', price: 22000, salePrice: 17600, colors: ['그레이', '블랙', '브라운'], sizes: FREE, soldOut: [], isNew: false, isBest: false, description: '신축성이 좋은 립 조직의 비니.' },
  { id: 24, name: '울 머플러', category: '액세서리', type: 'scarf', price: 39000, colors: ['차콜', '베이지'], sizes: FREE, soldOut: [], isNew: true, isBest: false, description: '부드러운 울 혼방 머플러. 양끝 프린지 마감.' },
]

export const getProduct = (id) => PRODUCTS.find((p) => p.id === Number(id))

export const isOptionSoldOut = (product, color, size) =>
  product.soldOut.includes(`${color}|${size}`)

export const isColorSoldOut = (product, color) =>
  product.sizes.every((sz) => isOptionSoldOut(product, color, sz))

export const discountRate = (p) =>
  p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0

export const unitPrice = (p) => p.salePrice ?? p.price
